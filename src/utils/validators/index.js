import { registerValidator, loginValidator } from "./validateAuth.js";
import { changePasswordValidator, resetPasswordValidator, forgotPasswordValidator } from "./validatePassword.js";
import { updateProfileValidator, requestRoleValidator } from "./validateUser.js";
import { createNewsValidator, updateNewsValidator, newsStatusValidator } from "./validateNews.js";

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