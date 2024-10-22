// Enhanced UserDetailPage component
"use client";

import * as React from "react";
import { useQuery, useMutation } from "@apollo/client";
import client from "../../../apollo-client";
import { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  Autocomplete,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import type { User, Group } from "../../../../types";
import { GetInitials, GetImageUrl } from "../../../../utils";
import {
  GET_GROUPS,
  GET_USER_BY_ID,
  UPDATE_USER,
  ADD_USER_TO_GROUP,
  REMOVE_USER_FROM_GROUP,
} from "../../../../queries/queries";

export default function UserDetailPage() {
  const { id } = useParams();
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [availableGroups, setAvailableGroups] = useState<
    { id: number; displayName: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Query to get the specific user
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    client,
    variables: {
      id: id,
    },
    skip: !id,
  });

  // Initialize the editable state when data is loaded
  useEffect(() => {
    if (data?.user && !editableUser) {
      setEditableUser(data.user);
    }
  }, [data, editableUser]);

  // Query to get all available groups
  const {
    loading: groupsLoading,
    error: groupsError,
    data: groupsData,
  } = useQuery(GET_GROUPS, {
    client,
  });

  // Update available groups when group data or user data changes
  useEffect(() => {
    if (groupsData?.groups) {
      setAvailableGroups(
        groupsData.groups
          .filter(
            (group: Group) =>
              !editableUser?.groups.some(
                (g: { id: number }) => g.id === group.id
              )
          )
          .map((group: { id: number; displayName: string }) => ({
            id: group.id,
            displayName: group.displayName,
          }))
      );
    }
  }, [groupsData, editableUser]);

  // Mutations to add and remove user from groups
  const [addUserToGroup] = useMutation(ADD_USER_TO_GROUP, { client });
  const [removeUserFromGroup] = useMutation(REMOVE_USER_FROM_GROUP, { client });

  // Mutation to update user details
  const [updateUser] = useMutation(UPDATE_USER, { client });

  // Handle loading and error states
  if (loading || groupsLoading) {
    return <LinearProgress />;
  }
  if (error || groupsError) {
    return (
      <Box mt={2}>
        <Alert severity="error">
          <strong>Error:</strong> {error?.message || groupsError?.message}
        </Alert>
      </Box>
    );
  }

  // Handle change in text fields
  const handleFieldChange =
    (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEditableUser((prev) =>
        prev ? { ...prev, [field]: value || "" } : prev
      );
    };

  // Handle group addition/removal
  const handleGroupChange = (
    group: { id: number; displayName: string },
    add: boolean
  ) => {
    if (editableUser) {
      if (add) {
        setEditableUser({
          ...editableUser,
          groups: [...editableUser.groups, group],
        });
        setAvailableGroups(availableGroups.filter((g) => g.id !== group.id));
      } else {
        setEditableUser({
          ...editableUser,
          groups: editableUser.groups.filter((g) => g.id !== group.id),
        });
        setAvailableGroups([...availableGroups, group]);
      }
    }
  };

  // Handle save button click
  const handleSave = () => {
    if (editableUser) {
      // Update user details
      updateUser({
        variables: {
          id: editableUser.id,
          input: {
            firstName: editableUser.firstName,
            lastName: editableUser.lastName,
            displayName: editableUser.displayName,
            email: editableUser.email,
          },
        },
      })
        .then(() => {
          alert("User details updated successfully");
        })
        .catch((err) => {
          console.error("Error updating user details:", err);
          setErrorMessage(`Error updating user details: ${err.message}`);
        });

      // Sync group membership
      const currentGroupIds = new Set(
        editableUser.groups.map((group) => group.id)
      );
      const initialGroupIds = new Set(
        data.user.groups.map((group: Group) => group.id)
      );

      // Add new groups
      editableUser.groups.forEach((group) => {
        if (!initialGroupIds.has(group.id)) {
          addUserToGroup({
            variables: { userId: editableUser.id, groupId: group.id },
          }).catch((groupErr) => {
            console.error("Error adding user to group:", groupErr);
            setErrorMessage(
              `Error adding user to group ${group.displayName}: ${groupErr.message}`
            );
          });
        }
      });

      // Remove old groups
      data.user.groups.forEach((group: Group) => {
        if (!currentGroupIds.has(group.id)) {
          removeUserFromGroup({
            variables: { userId: editableUser.id, groupId: group.id },
          }).catch((groupErr) => {
            console.error("Error removing user from group:", groupErr);
            setErrorMessage(
              `Error removing user from group ${group.displayName}: ${groupErr.message}`
            );
          });
        }
      });
    }
  };

  return (
    <Box padding={4} maxWidth={600} margin="0 auto">
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      {/* Avatar */}
      <Box display="flex" justifyContent="center" mb={4}>
        {editableUser?.avatar ? (
          <Avatar
            src={GetImageUrl(editableUser.avatar)}
            sx={{ width: 100, height: 100 }}
          />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }}>
            {GetInitials(
              editableUser?.firstName ?? "",
              editableUser?.lastName ?? ""
            ) || "U"}
          </Avatar>
        )}
      </Box>

      {/* Non-Editable Fields */}
      <TextField
        label="User ID"
        value={editableUser?.id || ""}
        color="secondary"
        focused
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <TextField
        label="Creation Date"
        value={
          editableUser?.creationDate
            ? dayjs(editableUser.creationDate).format("YYYY-MM-DD HH:mm")
            : ""
        }
        color="secondary"
        focused
        fullWidth
        margin="normal"
        InputProps={{ readOnly: true }}
      />

      {/* Editable Fields */}
      <TextField
        label="First Name"
        value={editableUser?.firstName || ""}
        fullWidth
        margin="normal"
        onChange={handleFieldChange("firstName")}
      />
      <TextField
        label="Last Name"
        value={editableUser?.lastName || ""}
        fullWidth
        margin="normal"
        onChange={handleFieldChange("lastName")}
      />
      <TextField
        label="Display Name"
        value={editableUser?.displayName || ""}
        fullWidth
        margin="normal"
        onChange={handleFieldChange("displayName")}
      />
      <TextField
        label="Email"
        value={editableUser?.email || ""}
        fullWidth
        margin="normal"
        onChange={handleFieldChange("email")}
      />

      {/* Groups */}
      <Box mt={2} mb={2}>
        <Autocomplete
          options={availableGroups}
          getOptionLabel={(option) => option.displayName}
          renderInput={(params) => (
            <TextField {...params} label="Add to group" />
          )}
          onChange={(event, value) => {
            if (value) {
              handleGroupChange(value, true);
            }
          }}
        />
        <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
          {editableUser?.groups.map((group, index) => (
            <Chip
              key={index}
              label={group.displayName}
              onDelete={() => {
                handleGroupChange(group, false);
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Save Button */}
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
}
