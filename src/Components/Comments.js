// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import {
//   collection,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   setDoc
// } from 'firebase/firestore';
// import NewJob from './Forms/NewJob';
// import {
//   Grid,
//   Modal,
//   Fade,
//   Backdrop,
//   Box,
//   Fab,
//   Skeleton,
//   Snackbar,
//   Alert,
//   Slide,
//   AlertTitle,
// } from '@mui/material';
// import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
// import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
// import { format } from 'date-fns';
// import { signOut, onAuthStateChanged, } from '@firebase/auth';
// import { auth } from '../firebase';
// import Header from '../Layout/Header';
// import Profile from './User/Profile';
// import MasterList from './MasterList';
// import { AnimateKeyframes } from 'react-simple-animate';
// import { THEME } from '../Layout/Theme';
// import SignIn from './User/SignIn';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// const Comments = (props) => {

//   const { themeMode } = props;

//   const [comments, setComments] = useState([]);

//   const [response, setResponse] = useState('');

//   const jobsReference = collection(db, 'jobs');

//   const [open, setOpen] = useState(false);

//   const [user] = useState('Jesse');

//   const modalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     minWidth: 525,
//     maxHeight: '85%',
//     bgcolor: THEME[themeMode].card,
//     color: THEME[themeMode].textColor,
//     borderRadius: 5,
//     boxShadow: 24,
//     p: 4,
//     overflowY: 'auto'
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setResponse({
//       ...response,
//       [name]: value
//     });
//   };

//   const addComment = () => {
//     const newComments = [...comments];
//     const newResponse = {
//       name: user,
//       userId: '',
//       photoUrl: '',
//       comment: response,
//       timeStamp: new Date(),
//     }
//     newComments.push(newResponse);
//     setComments(newComments);
//   }

//   const handleViewComments = async (job) => {
//     const commentsSubCollection = collection(jobsReference, `${job.id}/comments`);
//     const commentsQuery = await getDocs(commentsSubCollection);
//     const extractedComments = commentsQuery.docs.map((doc) => ({
//       ...doc.data(), id: doc.id
//     }));
//     setComments(extractedComments);
//     setOpen(true);
//   }

//   useEffect(() => {
//     const newComments = [...comments];
//     setComments(newComments);
//   }, [comments]);

//   return (
//     <>
//       <Modal
//         open={open}
//         onClose={() => setOpen(!open)}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{ timeout: 500 }}
//       >
//         <Fade in={open}>
//           <Box container sx={modalStyle} className='modal'>
//             {comments.map((comment, idx) => {
//               return (
//                 <p>comment</p>
//               )
//             })}
//             <div>
//               <form action="POST">
//                 <input type="text" name='comment' value={response} onChange={handleInputChange} />
//                 <button onSubmit={() => addComment()}>Send</button>
//               </form>
//             </div>
//           </Box>
//         </Fade>
//       </Modal>
//     </>
//   )
// }

// export default Comments;