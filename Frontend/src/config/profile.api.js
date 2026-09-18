import api from "./api.js";

export const updateProfile = async (userData) => {
    await api.patch("/user/update-profile", userData)
}

export const uploadProfileImg = async ({ url, publicId }) => {
    const { data } = await api.post("/user/profile-img", { url, publicId: publicId || "" })
    return data.user
}