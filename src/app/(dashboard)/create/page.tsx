"use client";

import * as React from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import client from '../../apollo-client';
import { CREATE_USER, CREATE_GROUP } from '../../../queries/queries';

const CreateUserGroupPage = () => {
  // State to track whether the user is creating a user or a group
  const [entityType, setEntityType] = React.useState('user');

  // State to store form data for user or group creation
  const [formData, setFormData] = React.useState({
    id: '',
    avatar: '',
    displayName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    groupName: ''
  });

  // Apollo Client mutation hook to create a user
  const [createUser] = useMutation(CREATE_USER, { client });
  // Apollo Client mutation hook to create a group
  const [createGroup] = useMutation(CREATE_GROUP, { client });

  // Handler to change the entity type (user or group)
  const handleEntityTypeChange = (event) => {
    console.log('Entity type changed to:', event.target.value); // Debug log for entity type change
    setEntityType(event.target.value);
  };

  // Handler to update form data when input fields change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log('Input changed:', name, value); // Debug log for input changes
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler to submit the form and create a user or group
  const handleSubmit = async () => {
    console.log('Form submitted with data:', formData); // Debug log for form submission
    try {
      if (entityType === 'user') {
        // Ensure required fields are provided
        if (!formData.id || !formData.email || !formData.password || formData.password !== formData.confirmPassword) {
          console.error('ID, email, and matching passwords are required to create a user');
          return;
        }
        // Create a user with the provided details
        console.log('Creating user with data:', formData); // Debug log before creating user
        await createUser({ variables: { user: {
          id: formData.id,
          email: formData.email,
          displayName: formData.displayName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          avatar: formData.avatar,
          password: formData.password // Add password field to the mutation
        }}});
        console.log('User created successfully');
      } else {
        // Ensure group name is provided
        if (!formData.groupName) {
          console.error('Group name is required to create a group');
          return;
        }
        // Create a group with the provided group name
        console.log('Creating group with name:', formData.groupName); // Debug log before creating group
        await createGroup({ variables: { name: formData.groupName } });
        console.log('Group created successfully');
      }
    } catch (error) {
      // Log any errors that occur during the mutation
      console.error('Error creating entity:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      {/* Title indicating whether the form is for creating a user or a group */}
      <Typography variant="h5" mb={2}>Create New {entityType === 'user' ? 'User' : 'Group'}</Typography>
      
      {/* Dropdown to select entity type (user or group) */}
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="entity-type-label">Entity Type</InputLabel>
        <Select
          labelId="entity-type-label"
          value={entityType}
          onChange={handleEntityTypeChange}
          label="Entity Type"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="group">Group</MenuItem>
        </Select>
      </FormControl>

      {/* Form fields for creating a user or group */}
      {entityType === 'user' ? (
        // If creating a user, show detailed input fields
        <>
          <TextField
            fullWidth
            label="User name"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            type="file"
          />
          <TextField
            fullWidth
            label="Display name"
            name="displayName"
            value={formData.displayName}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Mail"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            type="password"
          />
          <TextField
            fullWidth
            label="Confirm password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            type="password"
          />
        </>
      ) : (
        // If creating a group, show group name input field
        <TextField
          fullWidth
          label="Group Name"
          name="groupName"
          value={formData.groupName}
          onChange={handleInputChange}
          margin="normal"
          variant="outlined"
        />
      )}

      {/* Button to submit the form and create the entity */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Create {entityType === 'user' ? 'User' : 'Group'}
      </Button>
    </Box>
  );
};

export default CreateUserGroupPage;