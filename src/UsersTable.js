



import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import RegistrationForm from './RegistrationForm';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import UpdateUser from './UpdateUser';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: `1px solid ${alpha(theme.palette.common.black, 0.15)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '25%',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#04000c',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
    '&::placeholder': {
      color: '#0E3B64',
      fontWeight: 'bold',
      textAlign: 'left',
    },
  },
}));

const RedButton = styled(Button)(({ theme }) => ({
  color: 'white',
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'block',
  padding: theme.spacing(1),
  backgroundColor:'white',
  textAlign: 'left',
  fontSize: '0.9rem',
  borderBottom: 'none',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const columns = [
  { id: 'propertyType', label: 'propertyType', minWidth: 150 },
  { id: 'extentInSqYds', label: 'Extent (sq. yds)', minWidth: 150 },
  { id: 'address', label: 'Property Address', minWidth: 150 },
  { id: 'boundaries', label: 'Boundaries', minWidth: 150 },
  { id: 'currentOwnerName', label: 'Current Registered Owner', minWidth: 150 },
  { id: 'documentType', label: 'Document Type', minWidth: 150 },
  { id: 'documentNumber', label: 'Document Number', minWidth: 150 },
  { id: 'yearOfPurchase', label: 'Year of Purchase', minWidth: 150 },
  { id: 'sellerName', label: 'Seller Name', minWidth: 150 },
  { id: 'registrationDate', label: 'Registration Date', minWidth: 150 },
  { id: 'registrarOffice', label: 'Register Office/Sub Register Office', minWidth: 150 },
  { id: 'Action', label: 'Action', minWidth: 40},
];

const UsersTable = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setrowsPerPage] = useState(5);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [Error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, allUsers]);

  const fetchUsers = () => {
    axios.get('http://localhost:8089/api/properties/getAll')
      .then(response => {
        setAllUsers(response.data);
        setFilteredUsers(response.data);
        setSuggestions(generateSuggestions(response.data));
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const generateSuggestions = (users) => {
    const suggestionsSet = new Set();
    users.forEach(user => {
      const fields = [
        user.propertyType,
        user.address,
        user.currentOwnerName,
      ];
      fields.forEach(field => {
        if (field) {
          field.split(' ').forEach(word => {
            if (word.length > 2) { // Minimum length for suggestions
              suggestionsSet.add(word.toLowerCase());
            }
          });
        }
      });
    });
    return Array.from(suggestionsSet);
  };

  const filterUsers = () => {
    const query = (searchQuery || '').trim().toLowerCase();

    if (query === '') {
      setFilteredUsers(allUsers);
      setError('');
      setSuggestions(generateSuggestions(allUsers));
    } else {
      const filtered = allUsers.filter(user => {
        const propertyType = (user.propertyType || '').toLowerCase();
        const address = (user.address || '').toLowerCase();
        const currentOwnerName = (user.currentOwnerName || '').toLowerCase();
        const extentInSqYds = (String(user.extentInSqYds || '')).toLowerCase();
        const boundary = (user.boundary || '').toLowerCase();
        const documentType = (user.documentType || '').toLowerCase();
        const documentNumber = (user.documentNumber || '').toLowerCase();
        const yearOfPurchase = (String(user.yearOfPurchase || '')).toLowerCase();
        const sellerName = (user.sellerName || '').toLowerCase();
        const registrationDate = (String(user.registrationDate || '')).toLowerCase();
        const registrarOffice = (user.registrarOffice || '').toLowerCase();
        return (
          propertyType.includes(query) ||
          address.includes(query) ||
          currentOwnerName.includes(query) ||
          extentInSqYds.includes(query) ||
          boundary.includes(query) ||
          documentType.includes(query) ||
          documentNumber.includes(query) ||
          yearOfPurchase.includes(query)||
          sellerName.includes(query) ||
          registrationDate.includes(query)||
          registrarOffice.includes(query)
        );
      });

      setFilteredUsers(filtered);
      setError(filtered.length === 0 ? 'No properties found. Please adjust your search.' : '');
      setSuggestions(generateSuggestions(filtered));
    }
  };

  const handlePreviousButtonClick = () => {
    setPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextButtonClick = () => {
    if ((page + 1) * rowsPerPage < filteredUsers.length) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <AppBar position="static" sx={{ p: 1, backgroundColor: 'white' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: '#4a148c', fontWeight: 'bold' }}
          >
            Property Management
          </Typography>
          <Search>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <List
                sx={{
                  position: 'absolute',
                  backgroundColor: 'white',
                  boxShadow: 2,
                  width: '100%',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {suggestions.filter(suggestion => suggestion.includes(searchQuery.toLowerCase())).map((suggestion, index) => (
                  <ListItem button key={index} onClick={() => setSearchQuery(suggestion)}>
                    {suggestion}
                  </ListItem>
                ))}
              </List>
            )}
          </Search>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '35px' }}>
        <Button
          variant="contained"
          color='error'
          onClick={handleOpenDrawer}
          startIcon={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'white',
              color: 'red'
            }}>
              <AddIcon fontSize="small" />
            </div>
          }
          style={{ textTransform: 'none' }}
        >
          Add Property
        </Button>
      </Box>
      <div style={{ width: '100%' }}>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '35px' }}>
          <TableContainer sx={{ height: 368, width: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align || 'left'}
                      style={{ minWidth: column.minWidth, fontWeight: 'bold',color:'#4a148c' }}
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <StyledTableCell>{row.propertyType}</StyledTableCell>
                    <StyledTableCell>{row.extentInSqYds}</StyledTableCell>
                    <StyledTableCell>{row.address}</StyledTableCell>
                    <StyledTableCell>{row.boundary}</StyledTableCell>
                    <StyledTableCell>{row.currentOwnerName}</StyledTableCell>
                    <StyledTableCell>{row.documentType}</StyledTableCell>
                    <StyledTableCell>{row.documentNumber}</StyledTableCell>
                    <StyledTableCell>{row.yearOfPurchase}</StyledTableCell>
                    <StyledTableCell>{row.sellerName}</StyledTableCell>
                    <StyledTableCell>{row.registrationDate}</StyledTableCell>
                    <StyledTableCell>{row.registrarOffice}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Typography onClick={() => handleEditClick(row)} sx={{ cursor: 'pointer', fontSize: '13px' }}>Edit</Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <hr />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <Button
              onClick={handlePreviousButtonClick}
              sx={{ color: '#0E3B64', backgroundColor: 'whitesmoke', marginRight: '8px', textTransform: 'capitalize'}}
              className="CustomButton"
              disabled={page === 0}
            >
              Previous
            </Button>
            <RedButton
              onClick={handleNextButtonClick}
              sx={{ color: 'white', marginRight: '8px' }}
              className="CustomButton"
            >
              {page + 1}
            </RedButton>
            <Button
              onClick={handleNextButtonClick}
              sx={{ color: '#0E3B64', backgroundColor: 'whitesmoke', marginRight: '8px', textTransform: 'capitalize' }}
              className="CustomButton"
              disabled={(page + 1) * rowsPerPage >= filteredUsers.length}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{ '& .MuiDrawer-paper': { width: 516, padding: 2, marginTop: '113px' } }}
      >
        {selectedUser ? (
          <UpdateUser user={selectedUser} onClose={handleCloseDrawer} />
        ) : (
          <RegistrationForm onClose={handleCloseDrawer} />
        )}
      </Drawer>
    </Box>
  );
};

export default UsersTable;
