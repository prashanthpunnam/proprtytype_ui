





import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  TextField,
  Grid,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import PropTypes from 'prop-types';

const UpdateUser = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    extentInSqYds: '',
    address: '',
    boundary: '',
    currentOwnerName: '',
    documentType: '',
    documentNumber: '',
    yearOfPurchase: '',
    sellerName: '',
    registrationDate: '',
    registrarOffice: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        propertyType: user.propertyType || '',
        extentInSqYds: user.extentInSqYds || '',
        address: user.address || '',
        boundary: user.boundary || '',
        currentOwnerName: user.currentOwnerName || '',
        documentType: user.documentType || '',
        documentNumber: user.documentNumber || '',
        yearOfPurchase: user.yearOfPurchase || '',
        sellerName: user.sellerName || '',
        registrationDate: user.registrationDate || '',
        registrarOffice: user.registrarOffice || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors({ ...formErrors, ...errors });
  };

  const validateField = (name, value) => {
    const errors = {};
    // Add validation logic here
    if (name === 'extentInSqYds' && isNaN(value)) {
      errors[name] = 'Extent in Sq. Yds must be a number';
    }
    // Add other validation rules as needed
    return errors;
  };

  const validateForm = () => {
    const errors = {};
    for (const key in formData) {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(errors, fieldErrors);
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      console.log('Form data being sent:', formData); 
      axios.put(`http://localhost:8089/update/${user.id}`, formData)
        .then(response => {
          console.log('Response from server:', response);
          setSnackbar({
            open: true,
            message: 'User updated successfully.',
            severity: 'success',
          });
          setFormErrors({});
          onClose(); 
        })
        .catch(error => {
          console.error('Error updating user:', error); 
          setSnackbar({
            open: true,
            message: 'Failed to update user. Please try again later.',
            severity: 'error',
          });
        });
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px', width: '500px', paddingTop: '0px' }}>
      <Grid item xs={3}>
        <Button
          sx={{
            height: '60px',
            marginTop: '10px',
            width: '90px',
            marginBottom: '20px',
            borderTopLeftRadius: '40%',
            borderBottomLeftRadius: '40%',
          }}
          variant="contained"
          color="error"
          onClick={onClose}
        >
          Close
        </Button>
      </Grid>
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '-70px', marginBottom: '40px', marginLeft: '5px' }}>
        Edit Details
      </Typography>
      <form onSubmit={handleSubmit}>
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <FormControl fullWidth error={!!formErrors.propertyType}>
        <InputLabel>Property Type*</InputLabel>
        <Select
          required
          name="propertyType"
          value={formData.propertyType}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Property Type"
        >
          <MenuItem value="House">House</MenuItem>
          <MenuItem value="Land">Land</MenuItem>
          <MenuItem value="Building">Building</MenuItem>
          <MenuItem value="Flat">Flat</MenuItem>
        </Select>
        <FormHelperText>{formErrors.propertyType}</FormHelperText>
      </FormControl>
    </Grid>
    <Grid item xs={12}>
      <TextField
        required
        fullWidth
        label="Extent in Sq. Yds"
        name="extentInSqYds"
        value={formData.extentInSqYds}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!formErrors.extentInSqYds}
        helperText={formErrors.extentInSqYds}
      />
    </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Property Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.address}
              helperText={formErrors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.boundary}>
              <InputLabel>Boundaries*</InputLabel>
              <Select
                required
                name="boundary"
                value={formData.boundary}
                onChange={handleChange}
                onBlur={handleBlur}
                label="boundary"
              >
                <MenuItem value="North">North</MenuItem>
                <MenuItem value="South">South</MenuItem>
                <MenuItem value="East">East</MenuItem>
                <MenuItem value="West">West</MenuItem>
              </Select>
              <FormHelperText>{formErrors.boundary}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Current Registered Owner Name"
              name="currentOwnerName"
              value={formData.currentOwnerName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.currentOwnerName}
              helperText={formErrors.currentOwnerName}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.documentType}>
              <InputLabel>documentType*</InputLabel>
              <Select
                required
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                onBlur={handleBlur}
                label="documentType"
              >
                <MenuItem value="Sale Deed">Sale Deed</MenuItem>
                <MenuItem value="Gift Deed">Gift Deed</MenuItem>
              </Select>
              <FormHelperText>{formErrors.documentType}</FormHelperText>
            </FormControl>
          </Grid>
          {formData.documentType === 'Sale Deed' && (
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.saleDeedType}>
                <InputLabel>Sale Deed Type*</InputLabel>
                <Select
                  required
                  name="saleDeedType"
                  value={formData.saleDeedType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Sale Deed Type"
                >
                  <MenuItem value="Absolute">Absolute</MenuItem>
                  <MenuItem value="Possession">Possession</MenuItem>
                  <MenuItem value="Irrevocable">Irrevocable</MenuItem>
                </Select>
                <FormHelperText>{formErrors.saleDeedType}</FormHelperText>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Document Number"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.documentNumber}
              helperText={formErrors.documentNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Year of Purchase"
              name="yearOfPurchase"
              value={formData.yearOfPurchase}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.yearOfPurchase}
              helperText={formErrors.yearOfPurchase}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Seller Name"
              name="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.sellerName}
              helperText={formErrors.sellerName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Registration Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              name="registrationDate"
              value={formData.registrationDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.registrationDate}
              helperText={formErrors.registrationDate}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Register Office/Sub-Register Office"
              name="registrarOffice"
              value={formData.registrarOffice}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.registrarOffice}
              helperText={formErrors.registrarOffice}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            startIcon={<CheckCircleIcon color='success' />}
            variant="contained"
            color="inherit"
            style={{ marginTop: '10px', marginBottom: '100px' }}
          >
            Update
          </Button>
          <Button
            onClick={() => {
              onClose();
              window.location.reload();
            }}
            color="inherit"
            variant="contained"
            startIcon={<CancelIcon color="error" />}
            sx={{ marginTop: '10px', marginLeft: '10px', marginBottom: '100px' }}
          >
            Cancel
          </Button>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

UpdateUser.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default UpdateUser;
