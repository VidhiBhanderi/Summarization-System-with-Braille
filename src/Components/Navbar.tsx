import Person from '../assets/Photos/Person.png'
import { AppBar, Toolbar, Typography, Button, IconButton, ListItemIcon, MenuItem, MenuList, Popover, Divider } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AppBarWithMenu() {

  const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(null); // Anchor element for the profile popover

  const Username = sessionStorage.getItem("User");

  //  On Profile Click
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget); // Open the profile popover
  };
  
  //  On Profile Close
  const handleProfileClose = () => {
    setProfileAnchorEl(null); // Close the profile popover
  };

  const openProfile = Boolean(profileAnchorEl);

  const profileId = openProfile ? 'profile-popover' : undefined; 

    return (
        <AppBar position="fixed">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0 , fontWeight:'Bold' , marginRight:'10px' }}>
                    SummaBraille Synthesizer
                </Typography>
                
          {/* Profile Pic and Name Section With Pop Over */}
          <div style={{display:'flex' , alignItems:'center'}}>
          <Divider orientation='vertical' flexItem  style={{color:'black' , width:'2px'}}/>
            <IconButton
              color="inherit"
              aria-label="profile"
              edge="end"
              size='large'
              onClick={handleProfileClick}
            >
              <img src={Person} alt="Logo" style={{ maxWidth: '50px', maxHeight: '50px'}} />
            </IconButton>
              <Popover
                id={profileId}
                open={openProfile}
                anchorEl={profileAnchorEl}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {/* Profile Popover content */}
                  <MenuList autoFocusItem={openProfile} id="profile-menu">
                    <MenuItem component={Link} to="/Logout" onClick={handleProfileClose}>
                      <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Popover>
              <Typography onClick={handleProfileClick} style={{marginLeft:'5px' , userSelect:'none'}}>{Username}</Typography>
            </div>
          </Toolbar>
        </AppBar>
    );
}
