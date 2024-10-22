"use client";

import * as React from "react";
import { useQuery } from "@apollo/client";
import Fuse from "fuse.js";
import client from "../../apollo-client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import { LinearProgress, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { GetImageUrl, GetInitials } from "../../../utils";
import type { User } from "../../../types";
import { GET_USERS } from "../../../queries/queries";

function SearchBar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <TextField
      label="Search Users"
      variant="outlined"
      fullWidth
      margin="normal"
      value={search}
      onChange={onSearchChange}
    />
  );
}

// GroupChips Component
function GroupChips({ groups }: { groups: { displayName: string }[] }) {
  return (
    <div>
      {groups.map((group, index) => (
        <Chip
          key={index}
          label={group.displayName}
          variant="outlined"
          sx={{ marginRight: 1 }}
        />
      ))}
    </div>
  );
}

// AvatarLink Component for rendering centered avatar with padding
function AvatarLink({ avatar, firstName, lastName }: User) {
  const imageUrl = GetImageUrl(avatar);
  return (
    <Box display="flex" justifyContent="center" alignItems="center" p={2}>
      {imageUrl ? (
        <Avatar src={imageUrl} />
      ) : (
        <Avatar>{GetInitials(firstName, lastName)}</Avatar>
      )}
    </Box>
  );
}

// EmailLink Component for rendering email as a mailto link
function EmailLink({ email }: { email: string }) {
  return (
    <Link href={`mailto:${email}`} color="secondary">
      {email}
    </Link>
  );
}

// CenteredCell Component to center content in a cell
function CenteredCell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      {children}
    </Box>
  );
}

export default function SearchPage() {
  const [search, setSearch] = React.useState("");
  const router = useRouter(); // Initialize router from next/navigation

  // Apollo useQuery hook to fetch users
  const { loading, error, data } = useQuery(GET_USERS, {
    client: client,
  });

  // Check loading state and any errors in fetching data
  if (loading) return <LinearProgress />;
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        py={4}
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom>
          Oops! Something went wrong.
        </Typography>
        <Typography variant="body1" gutterBottom>
          We encountered an error while processing your request.
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Error Details: {(error as Error).message}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Box>
    );
  }

  // Fuse.js configuration for fuzzy searching
  const fuse = new Fuse(data.users, {
    keys: ["displayName", "email", "firstName", "lastName"],
    threshold: 0.3,
  });

  // Get the filtered users based on search input
  const filteredUsers = search
    ? fuse.search(search).map((result) => result.item)
    : data.users;

  // Define columns for the DataGrid
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Avatar",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <AvatarLink
            avatar={params.row.avatar}
            firstName={params.row.firstName}
            lastName={params.row.lastName}
          />
        </CenteredCell>
      ),
    },
    {
      field: "id",
      headerName: "Username",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <Typography>{params.value}</Typography>
        </CenteredCell>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <EmailLink email={params.value} />
        </CenteredCell>
      ),
    },
    {
      field: "displayName",
      headerName: "Display Name",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <Typography>{params.value}</Typography>
        </CenteredCell>
      ),
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <Typography>{params.value}</Typography>
        </CenteredCell>
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <Typography>{params.value}</Typography>
        </CenteredCell>
      ),
    },
    {
      field: "creationDate",
      headerName: "Creation Date",
      flex: 1,
      renderCell: (params) => (
        <CenteredCell>
          <Typography>
            {dayjs(params.value).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </CenteredCell>
      ),
    },
    {
      field: "groups",
      headerName: "Groups",
      flex: 1,
      renderCell: (params) => <GroupChips groups={params.value} />,
    },
  ];

  // Transform data to match DataGrid row structure
  const rows = filteredUsers.map((user: User) => ({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    creationDate: user.creationDate,
    groups: user.groups,
  }));

  // Handle row click
  const handleRowClick = (params: any) => {
    const userId = params.id as string;
    router.push(`/user/${userId}`);
  };

  return (
    <>
      {/* Search input for filtering users */}
      <SearchBar
        search={search}
        onSearchChange={(e) => setSearch(e.target.value)}
      />

      {/* DataGrid to display user information */}
      <UserDataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
    </>
  );
}

// UserDataGrid Component with row click handler
function UserDataGrid({
  rows,
  columns,
  onRowClick,
}: {
  rows: User[];
  columns: GridColDef[];
  onRowClick: (params: any) => void;
}) {
  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={onRowClick}
      />
    </div>
  );
}
