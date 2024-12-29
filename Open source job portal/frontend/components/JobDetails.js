import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/jobs/${id}`) // Replace with your backend endpoint
      .then(response => setJob(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!job) return <p>Loading...</p>;

  return (
    <div>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <p>Requirements: {job.requirements}</p>
      <p>Location: {job.location}</p>
    </div>
  );
}

export default JobDetails;
