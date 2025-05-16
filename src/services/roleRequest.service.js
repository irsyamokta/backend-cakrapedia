import * as roleRequestRpository from "../repositories/roleRequest.repository.js";
import * as userRepository from "../repositories/user.repository.js";
import { uploadPDF } from "../utils/upload.utils.js";
import { requestRoleValidator } from "../utils/validators/validateUser.js";
import { BadRequestError, NotFoundError } from "../utils/errors.utils.js";

export const getUserRoleRequests = async (page, limit) => {
    const requests = await roleRequestRpository.getUserRequestRole(page, limit);
    if (!requests) throw new NotFoundError("Tidak ada data permintaan");

    return requests;
};

export const getUserRoleRequestById = async (requestId) => {
    const request = await roleRequestRpository.getUserRequestRoleById(requestId);
    if (!request) throw new NotFoundError("Permintaan tidak ditemukan");

    return request;
};

export const getUserRoleRequestByUserId = async (userId) => {
    const request = await roleRequestRpository.getUserRequestRoleByUserId(userId);
    if (!request) throw new NotFoundError("Tidak ada data permintaan");

    return request;
};

export const createUserRoleRequest = async (userId, data, file) => {
    const { error } = requestRoleValidator(data);
    if (error) {
        const message = error.details.map(err => err.message);
        throw new BadRequestError("Validasi gagal", message);
    }

    const user = await userRepository.getUserById(userId, { email: true });
    if (!user) throw new NotFoundError("Akun tidak ditemukan");

    if (!file) throw new BadRequestError("Portfolio tidak boleh kosong!", ["Upload portfolio diperlukan"]);

    const { roleRequested } = data;
    const pdfUrl = await uploadPDF(file);

    const requestData = {
        userId,
        roleRequested,
        portfolio: pdfUrl.fileUrl
    }

    const existingRequest = await roleRequestRpository.getExistingRequest(userId, "PENDING");
    if (existingRequest) throw new BadRequestError("Tidak dapat membuat permintaan baru", ["Permintaan sudah dikirim sebelumnya"]);

    const requestRole = await roleRequestRpository.createUserRequestRole(requestData)

    return { message: "Permintaan berhasil dikirim", requestRole }
};

export const updateUserRoleRequest = async (requestId, adminId, data) => {
    const getRequest = await roleRequestRpository.getUserRequestRoleById(requestId);
    if (!getRequest) throw new NotFoundError("Permintaan tidak ditemukan");

    if (getRequest.status === "APPROVED")
        throw new BadRequestError("Permintaan tidak valid", ["Permintaan sudah diproses sebelumnya"]);

    const { action, reason } = data;

    const updateData = {
        status: action === "APPROVED" ? "APPROVED" : "REJECTED",
        rejectReason: reason,
        reviewedBy: {
            connect: { id: adminId }
        },
        reviewedAt: new Date()
    };

    const updatedRequest = await roleRequestRpository.updateUserRequestRole(requestId, updateData);

    const updateUserRole = {
        role: getRequest.roleRequested,
        status: action === "APPROVED" ? "APPROVED" : "REJECTED"
    }

    if (action === "APPROVED") {
        await userRepository.updateUserRole(getRequest.userId, updateUserRole);
    }

    return {
        message: `Permintaan ${action === "APPROVED" ? "disetujui" : "ditolak"}`,
        updatedRequest
    };
};

export const deleteUserRoleRequest = async (requestId) => {
    const request = await roleRequestRpository.getUserRequestRoleById(requestId);
    if (!request) throw new NotFoundError("Permintaan tidak ditemukan");

    if(request.publicId) {
        await deleteImageFromCloudinary(request.publicId);
    }

    await roleRequestRpository.deleteUserRequestRole(requestId);

    return { message: "Permintaan berhasil dihapus" };
};