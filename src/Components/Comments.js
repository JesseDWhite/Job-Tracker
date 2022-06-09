import React, { useState } from 'react';
import {
  collection,
  addDoc,
} from 'firebase/firestore';
import {
  Grid,
  Box,
  TextField,
  Typography,
  Avatar,
  Tooltip,
  Fab
} from '@mui/material';
import { SendRounded } from '@mui/icons-material';
import { AnimateKeyframes } from 'react-simple-animate';

const Comments = (props) => {

  const {
    comments,
    setComments,
    user,
    jobToEdit,
    userReference
  } = props;

  const initialValues = {
    name: user.displayName,
    userId: user.uid,
    photoUrl: user.photoURL,
    response: '',
    timeStamp: new Date(),
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
    newComments.push(formValues);
    setComments(newComments);
    const jobsSubCollection = collection(userReference, `${jobToEdit.user}/jobs`);
    const commentsSubCollection = collection(jobsSubCollection, `${jobToEdit.id}/comments`)
    await addDoc(commentsSubCollection, {
      ...formValues
    });
    setFormValues(initialValues);
  }

  return (
    <>
      <Box container>
        <Typography
          variant='h4'
          sx={{
            textAlign: 'center',
            mb: 3
          }}
        >
          {jobToEdit.company}
        </Typography>

        {comments.map((comment, idx) => {
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
        })}
        <div>
          <form onSubmit={(e) => addComment(e)}>
            <Grid
              container
            >
              <Grid
                item
                xs={10}
              >
                <TextField
                  fullWidth
                  autoFocus
                  multiline
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