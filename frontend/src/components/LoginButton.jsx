const LoginButton = ({ onClick, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      Login
    </button>
  );
};

export default LoginButton;