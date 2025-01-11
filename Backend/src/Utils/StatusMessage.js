export default class StatusMessage {
    static QUERY_ERROR = 'An error occurred while executing the query.';
    static NOT_FOUND_BY_ID = 'No record found with the specified ID.';
    static INTERNAL_SERVER_ERROR =
        'The server encountered an error while processing the request.';
    static BAD_REQUEST =
        'The server could not understand the request due to invalid input. Please verify your request and try again.';
    static WRONG_PASSWORD =
        'The password you entered is incorrect. Please try again.';
    static WRONG_USERNAME =
        'The username you entered does not exist. Please try again.';
    static ALREADY_LOGGED_IN = 'Already logged in.';
    static ACCESS_NOT_AUTHORIZED = 'Access not authorized.';
    static DUPLICATE_USERNAME_OR_EMAIL = 'Username or email already in use.';
    static DUPLICATE_USERNAME = 'Username already in use.';
    static DUPLICATE_EMAIL = 'Email already in use.';
    static LOGOUT_SUCCESS = 'Logout successful!';
    static ACC_CONFIRMATION_REQUIRED =
        'Please confirm your account before sign in. A confirmation link was sent to your email.';
    static CONFIRM_ACC_TOKEN_EXPIRED =
        'The token to confirm the account expired. A new one has been sent to your email.';
    static ACC_SUCCESSFULLY_CONFIRMED =
        'Your account has been successfully confirmed!';
    static REFRESH_TOKEN_EXPIRED =
        'Refresh token is invalid or has expired. Please log in again.';
    static REFRESH_TOKEN_REVOKED =
        'Refresh token was revoked. Please log in again.';
    static ACC_ALREADY_CONFIRMED = 'Account has already being confirmed.';
    static INVALID_EMAIL = 'No account found with this email address.';
    static RESET_PASS_EMAIL_SENT = 'Reset password email sent.';
    static CONFIRM_ACC_FIRST =
        'Please confirm your account before trying to reset your password.';
    static RESET_PASS_TOKEN_EXPIRED = 'The reset password link has expired.';
    static RESET_PASS_TOKEN_USED =
        'This password reset link has already been used. Please request a new password reset if needed.';
    static INVALID_PASSWORD =
        'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character (+.-_*$@!?%&).';
    static USER_NOT_FOUND = 'User not found.';
    static PASSWORD_UPDATED = 'Password updated successfully!';
    static NOT_LOGGED_IN = 'You are not logged in.';
    static SAME_PASSWORD =
        'Your new password must be different from the current one.';
    static INVALID_JSON = 'Invalid JSON payload.';
    static CANNOT_CHANGE_PASS =
        'Your account is linked to 42 School. Please manage your password on their site.';
    static CANNOT_EDIT_OTHER_PROFILE =
        "You do not have permission to modify another user's profile.";
    static NO_PROFILE_INFO_TO_EDIT = 'There was no profile info to edit.';
    static INVALID_USER_TAG = 'Invalid user tag.'
}
