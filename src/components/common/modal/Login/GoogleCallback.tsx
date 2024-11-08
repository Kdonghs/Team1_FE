import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../../provider/Auth';

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      handleGoogleCallback(code)
        .then(() => {
          navigate('/projectList');
        })
        .catch((err) => {
          console.error('Error handling Google callback:', err);
          navigate('/login');
        });
    }
  }, [handleGoogleCallback, navigate]);

  return <div>로그인 처리중...</div>;
};