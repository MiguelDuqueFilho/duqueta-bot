export const catchConnectError = (error) => {
  if (
    ![
      'Connection closed.',
      'Login unsuccessful.',
      'Error logging in.',
      'Invalid NICK',
    ].includes(error)
  ) {
    console.log(error);
  }
};
