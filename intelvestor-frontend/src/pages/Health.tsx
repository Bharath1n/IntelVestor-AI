import { useEffect, useState } from 'react';

const Health = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    fetch('http://backend:8080/actuator/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status === 'UP' ? 'ok' : 'down'))
      .catch(() => setStatus('down'));
  }, []);

  return <div>{`{"status":"${status}"}`}</div>;
};

export default Health;