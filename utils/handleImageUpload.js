const uploadImage = async (imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    // return the created id of image in cloud
    return result.public_id;
  } catch (error) {
    console.error(error);
  }
};

const createImageTag = (publicId) => {
  let imageTag = cloudinary.image(publicId, {
    transformation: [
      { width: 250, height: 250, gravity: "faces", crop: "thumb" },
      { radius: "max" },
    ],
  });
  return imageTag;
};

module.exports = { uploadImage, createImageTag };
