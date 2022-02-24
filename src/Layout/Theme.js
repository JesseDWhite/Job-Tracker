export const THEME = {
  darkMode: {
    header: '#263238',
    card: '#455A64',
    textColor: 'white',
    backgroundColor: '#37474F',
    chipColor: 'secondary',
    buttonStyle: 'contained',
    textField: {
      '& label.Mui-focused': {
        color: 'white',
      },
      '& label': {
        color: 'white',
        zIndex: 0
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'lightBlue',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'lightBlue',
        },
      },
    }
  },
  lightMode: {
    header: '#ECECEC',
    card: 'white',
    textColor: 'black',
    backgroundColor: '#F5F5F5',
    chipColor: 'default',
    buttonStyle: 'outlined',
    textField: {
      '& label.Mui-focused': {
        color: 'default',
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'default',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'default',
        },
        '&:hover fieldset': {
          borderColor: 'default',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'default',
        },
      },
    }
  }
}