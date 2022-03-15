import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import MyFollow from './MyFollow';
import MyPost from './MyPost';
import MyGroups from './MyGroups';
import MyMemo from './MyMemo';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
  <div className='h-[calc(100vh-110px)] ' >
<div className='bg-white border-solid rounded-md items-center my-10 overflow-x-hidden'>
  <Tabs value={value} onChange={handleChange}>

    <Tab label="MyFollows" {...a11yProps(0)} />
    <Tab label="MyPosts" {...a11yProps(1)} />
    <Tab label="MyGroups" {...a11yProps(2)} />
    <Tab label="MyMemos" {...a11yProps(3)} />

  </Tabs>
</div>        


<div className=' bg-white border-solid rounded-md ' id='scroll'>
  <TabPanel value={value} index={0}>
    <MyFollow/>
  </TabPanel>
  <TabPanel value={value} index={1}>
    <MyPost/>
  </TabPanel>
  <TabPanel value={value} index={2}>
    <MyGroups/>
  </TabPanel>
  <TabPanel value={value} index={3}>
 
    <MyMemo/>
  </TabPanel>
</div>
</div>
  );
}
