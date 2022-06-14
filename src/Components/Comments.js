import React, { useState, useEffect } from 'react';
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
import { format } from 'date-fns';


const Comments = (props) => {

  const {
    comments,
    setComments,
    user,
    jobToEdit,
    userReference,
    handleShowMoreComments,
    setJobToEdit,
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

  let bottomOfChat = document.querySelector('#bottom');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    if (e.nativeEvent.inputType === "insertLineBreak") return addComment(e);
  };

  const addComment = async (e) => {
    e.preventDefault();
    document.querySelector('.scroll').setAttribute('id', 'bottom');
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

  useEffect(() => {
    if (bottomOfChat) {
      bottomOfChat.scrollIntoView();
    };
  }, [comments]);

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
            cursor: 'default',
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
          disabled={comments.length < 25 ? true : false}
          onClick={() => ((handleShowMoreComments(jobToEdit.user, jobToEdit), bottomOfChat && document.querySelector('.scroll').removeAttribute('id')))}
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
              cursor: 'default',
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
                      arrow
                      title={`${comment.name} sent on ${comment.timeStamp instanceof Date
                        ? format(comment.timeStamp, 'PP')
                        : format(comment.timeStamp.toDate(), 'PP')} at ${comment.timeStamp instanceof Date
                          ? format(comment.timeStamp, 'p')
                          : format(comment.timeStamp.toDate(), 'p')
                        }`}
                      // title={comment.name}
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
                        borderRadius: 3,
                        cursor: 'default'
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
        <div id='bottom' className='scroll' />
      </Box>
    </>
  )
}

export default Comments;