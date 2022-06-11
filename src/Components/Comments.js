import React, { useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import {
  Grid,
  Box,
  TextField,
  Typography,
  Avatar,
  Tooltip,
  Fab,
  Button
} from '@mui/material';
import { SendRounded } from '@mui/icons-material';
import { AnimateKeyframes } from 'react-simple-animate';
import { THEME } from '../Layout/Theme';

const Comments = (props) => {

  const {
    comments,
    setComments,
    user,
    jobToEdit,
    userReference,
    handleShowMoreComments,
    setJobToEdit,
    currentUser
  } = props;

  const initialValues = {
    name: user.displayName,
    userId: user.uid,
    photoUrl: user.photoURL,
    response: '',
    timeStamp: new Date(),
    read: false
  }

  const [formValues, setFormValues] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const addComment = async (e) => {
    e.preventDefault();
    const newComments = [...comments];
    const newJobToEdit = { ...jobToEdit };
    newJobToEdit.unreadMessages = 0;
    newJobToEdit.lastResponseFrom = user.uid;

    newComments.push(formValues);
    newComments.forEach(comment => {
      if (comment.userId === user.uid && !comment.read) {
        newJobToEdit.unreadMessages += 1;
      }
    });
    setComments(newComments);

    // if (jobToEdit.lastResponseFrom !== user.uid) {
    //   const userToNotify = doc(userReference, jobToEdit.lastResponseFrom);
    //   await updateDoc(userToNotify, { notifications: true });
    // }

    setJobToEdit(newJobToEdit);

    const commentsSubCollection = collection(userReference, `${jobToEdit.user}/jobs/${jobToEdit.id}/comments`);
    await addDoc(commentsSubCollection, {
      ...formValues
    });

    await updateDoc(doc(collection(userReference, `${jobToEdit.user}/jobs`), jobToEdit.id), {
      lastResponseFrom: user.uid,
      unreadMessages: newJobToEdit.unreadMessages
    });

    setFormValues(initialValues);
  }

  return (
    <>
      <Box
        container
        sx={{
          position: 'relative'
        }}
      >
        <Typography
          variant='h4'
          sx={{
            textAlign: 'center',
            // mb: 3,
            position: 'sticky',
            top: 0,
            // pb: 3,
            // background: THEME[themeMode].card,
            // transition: 'background .5s',
            // zIndex: 10
          }}
        >
          {jobToEdit.company}
        </Typography>
        <Button
          fullWidth
          disabled={comments.length === 0 ? true : false}
          onClick={() => handleShowMoreComments(jobToEdit.user, jobToEdit)}
          sx={{
            my: 1
          }}
        >
          Load More Comments
        </Button>
        {comments.length === 0
          ? <Typography
            sx={{
              my: 3,
              textAlign: 'center',
              opacity: 0.35
            }}
          ><em>message directly with your advisor or student about this job application</em></Typography>
          : comments.map((comment, idx) => {
            return (
              <Box
                sx={{ py: 1 }}
              >
                <AnimateKeyframes
                  play
                  iterationCount={1}
                  keyframes={["opacity: 0", "opacity: 1"]}
                >
                  <Grid
                    container
                    direction={comment.userId === user.uid ? 'row' : 'row-reverse'}
                    justifyContent='flex-start'
                    alignItems='flex-center'
                  >
                    <Tooltip
                      title={comment.name}
                      placement={comment.userId === user.uid ? 'left' : 'right'}
                      disableInteractive>
                      <Avatar
                        alt={comment.name}
                        src={comment.photoUrl}
                        sx={{
                          mt: 1
                        }}
                      />
                    </Tooltip>
                    <Typography
                      sx={{
                        p: 2,
                        mx: 2,
                        maxWidth: '78%',
                        color: comment.userId === user.uid ? 'white' : 'black',
                        backgroundColor: comment.userId === user.uid ? 'rgb(33, 150, 243)' : 'rgb(207, 216, 220)',
                        borderRadius: 3
                      }}
                    >
                      {comment.response}
                    </Typography>
                  </Grid>
                </AnimateKeyframes>
              </Box>
            )
          })
        }

        <div>
          <form onSubmit={(e) => addComment(e)}>
            <Grid container>
              <Grid
                item
                xs={10}
              >
                <TextField
                  fullWidth
                  autoFocus
                  multiline
                  variant='outlined'
                  type='text'
                  name='response'
                  placeholder='Message'
                  value={formValues.response}
                  onChange={handleInputChange}
                  sx={{
                    mt: 2,
                  }}
                />
              </Grid>
              <Grid
                item
                xs={2}
              >
                <Fab
                  type='submit'
                  color='primary'
                  disabled={formValues.response.length > 0 ? false : true}
                  sx={{
                    mt: 2,
                    ml: 4
                  }}
                >
                  <SendRounded />
                </Fab>
              </Grid>
            </Grid>
          </form>
        </div>
      </Box>
    </>
  )
}

export default Comments;