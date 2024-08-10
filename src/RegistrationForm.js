
import React, { useState } from 'react';
import { TextField, Grid, Typography, Container, Button, Snackbar, Alert, MenuItem, Select, FormControl, InputLabel, FormHelperText, Drawer } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const RegistrationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    extentInSqYds: '',
    propertyAddress: '', 
    boundary: '',
    currentRegisteredOwnerName: '',
    documentType: '',
    documentNumber: '',
    yearOfPurchase: '',
    sellerName: '',
    registrationDate: '',
    registerOffice: '',
    saleDeedType: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'extentInSqYds') {
      const regex = /^[\d.,/!@#$%^&*()_+]+$/;
      if (regex.test(value) || value === '') {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === 'yearOfPurchase' && !/^\d*$/.test(value)) {
      return;
    } else if ((name === 'sellerName' || name === 'currentRegisteredOwnerName') && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    } else {
      setFormData({ ...formData, [name]: value });
    }

    const errors = validateField(name, value);
    if (!errors[name]) {
      const newFormErrors = { ...formErrors };
      delete newFormErrors[name];
      setFormErrors(newFormErrors);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
  };

  const validateField = (name, value) => {
    const errors = {};
    const numericWithSpecialCharsRegex = /^[\d.,/!@#$%^&*()_+]+$/; 
    const textRegex = /^[a-zA-Z\s]*$/;

    switch (name) {
      case 'propertyType':
      case 'extentInSqYds':
      case 'propertyAddress':
      case 'boundary':
      case 'currentRegisteredOwnerName':
      case 'documentType':
      case 'documentNumber':
      case 'sellerName':
      case 'registerOffice':
        if (value.trim() === '') {
          errors[name] = `${name.replace(/([A-Z])/g, ' $1').toUpperCase()} is required`;
        }
        break;
      case 'extentInSqYds':
        if (!numericWithSpecialCharsRegex.test(value)) {
          errors.extentInSqYds = 'Extent in Sq. Yds should contain only numbers and allowed special characters';
        }
        break;
      case 'yearOfPurchase':
        if (value.trim() === '') {
          errors.yearOfPurchase = 'Year of Purchase is required';
        } else if (!/^\d+$/.test(value)) {
          errors.yearOfPurchase = 'Year of Purchase should be numeric';
        }
        break;
      case 'sellerName':
      case 'currentRegisteredOwnerName':
        if (!textRegex.test(value)) {
          errors[name] = `${name.replace(/([A-Z])/g, ' $1').toUpperCase()} should only contain letters and spaces`;
        }
        break;
      case 'registrationDate':
        if (value.trim() === '') {
          errors.registrationDate = 'Registration Date is required';
        }
        break;
      default:
        break;
    }

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
      axios.post('http://localhost:8089/save', formData)
        .then(response => {
          console.log('User added:', response.data);
          setSnackbar({
            open: true,
            message: 'Registered Successfully',
            severity: 'success',
          });
          setFormErrors({});
          setFormData({
            propertyType: '',
            extentInSqYds: '',
            propertyAddress: '',
            boundary: '',
            currentRegisteredOwnerName: '',
            documentType: '',
            documentNumber: '',
            yearOfPurchase: '',
            sellerName: '',
            registrationDate: '',
            registerOffice: '',
            saleDeedType: '',
          });
        })
        .catch(error => {
          console.error('There was an error!', error);
          setSnackbar({
            open: true,
            message: 'Failed to save data. Please try again later.',
            severity: 'error',
          });
        });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });

    if (snackbar.severity === 'success') {
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const isFormValid = () => {
    const errors = validateForm();
    return Object.keys(errors).length === 0;
  };

  return (
    <Container 
    maxWidth="sm" style={{ padding: '20px', width: '500px',paddingtop:'0px',paddingBottom:'40px' }}>
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
          onClick={handleCancel}
        >
          Close
        </Button>
      </Grid>
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '-70px', marginBottom: '40px', marginLeft: '5px' }}>
        Property Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.propertyType}>
              <InputLabel>propertyType*</InputLabel>
              <Select
                required
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                onBlur={handleBlur}
                label="propertyType"
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
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.propertyAddress}
              helperText={formErrors.propertyAddress}
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
              name="currentRegisteredOwnerName"
              value={formData.currentRegisteredOwnerName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.currentRegisteredOwnerName}
              helperText={formErrors.currentRegisteredOwnerName}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!formErrors.documentType}>
              <InputLabel>Document Type*</InputLabel>
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
              inputProps={{ maxLength: 4 }} 
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
              name="registerOffice"
              value={formData.registerOffice}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.registerOffice}
              helperText={formErrors.registerOffice}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{marginBottom:'80px'}}>
          <Button
            type='submit'
            startIcon={<CheckCircleIcon color="success" />}
            variant="contained"
            color="inherit"
            disabled={!isFormValid()}
            style={{ marginTop: '10px' }}
          >
            Save
          </Button>
          <Button
            onClick={handleCancel}
            color="inherit"
            variant="contained"
            startIcon={<CancelIcon color="error" />}
            sx={{ marginTop: '10px', marginLeft: '10px' }}
          >
            Cancel
          </Button>
        </Grid>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegistrationForm;



