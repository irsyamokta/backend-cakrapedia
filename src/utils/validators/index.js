import { registerValidator, loginValidator } from "./authValidator.js";
import { changePasswordValidator, resetPasswordValidator, forgotPasswordValidator } from "./passwordValidator.js";
import { updateProfileValidator, requestRoleValidator } from "./userValidator.js";
import { createNewsValidator, updateNewsValidator, newsStatusValidator } from "./newsValidator.js";

export { 
    registerValidator, 
    loginValidator, 
    changePasswordValidator, 
    resetPasswordValidator, 
    forgotPasswordValidator,
    updateProfileValidator,
    requestRoleValidator ,
    createNewsValidator,
    updateNewsValidator,
    newsStatusValidator
};