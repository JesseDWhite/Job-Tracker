import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { THEME } from '../../Layout/Theme';

const StudentTable = (props) => {

  const { cohortStudents, themeMode } = props;

  return (
    <TableContainer>
      <Table
        sx={{
          // minWidth: 650,
          height: '100%',
          background: THEME[themeMode].card,
          color: THEME[themeMode].textColor,
          transition: 'color .5s, background .5s',
          border: 'none',
          px: 2
        }}
        size="large" aria-label="table of students assigned to you">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="left">Cohort</TableCell>
            <TableCell align="left">Email</TableCell>
            <TableCell align="left">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cohortStudents.map((student) => (
            <TableRow
              key={student.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" onClick={() => console.log(student.name)}>
                {student.name}
              </TableCell>
              <TableCell align="left">{student.cohort}</TableCell>
              <TableCell align="left">{student.email}</TableCell>
              <TableCell align="left">{student.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StudentTable;