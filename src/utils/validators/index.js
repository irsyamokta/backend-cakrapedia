import { registerValidator, loginValidator } from "./authValidator.js";
import { changePasswordValidator, resetPasswordValidator, forgotPasswordValidator } from "./passwordValidator.js";
import { updateProfileValidator } from "./userValidator.js";

export { 
    registerValidator, 
    loginValidator, 
    changePasswordValidator, 
    resetPasswordValidator, 
    forgotPasswordValidator,
    updateProfileValidator 
};