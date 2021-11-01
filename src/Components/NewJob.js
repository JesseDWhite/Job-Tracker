import React, { useState } from 'react';
import { addDoc } from 'firebase/firestore';

const initialValues = {
  company: '',
  dateApplied: '',
  jobDescription: '',
  jobTitle: '',
  status: ''
}

const NewJob = (props) => {

  const { jobsReference } = props;

  const [formValues, setFormvalues] = useState(initialValues);

  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;
    setFormvalues({
      ...formValues,
      [name]: value
    });
  };

  const createUser = async () => {
    await addDoc(jobsReference, {
      company: formValues.company,
      dateApplied: formValues.dateApplied,
      jobDescription: formValues.jobDescription,
      jobTitle: formValues.jobTitle,
      status: formValues.status,
    });
  };

  return (
    <>
      {console.log(formValues)}
      <h3>New Job</h3>
      <div>
        <input type="text" name='company' placeholder='Company' onChange={handleInputChange} />
        <input type="date" name='dateApplied' placeholder='Date Applied' onChange={handleInputChange} />
        <input type="text" name='jobDescription' placeholder='Job Description' onChange={handleInputChange} />
        <input type="text" name='jobTitle' placeholder='Job Title' onChange={handleInputChange} />
        <input type="text" name='status' placeholder='Status' onChange={handleInputChange} />
        <button onClick={createUser}>Create New Job</button>
      </div>
    </>
  );
};

export default NewJob;