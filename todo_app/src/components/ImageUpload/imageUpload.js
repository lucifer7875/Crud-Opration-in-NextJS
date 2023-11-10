import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ImageUpload = ({ value, onBlur, name, setFieldValue, getFieldProps }) => {
    const [selectedVideo, setSelectedVideo] = useState(null)
    const [selectedImage, setSelectedImage] = useState([])
    const [videoPreview, setVideoPreview] = useState(null)

    const [imagePreview, setImagePreview] = useState([])

    const API_URL =
        'http://localhost:5012/auth/imageupload'

    const handleFileChange = (e) => {

        const files = e.target.files

        console.log("20", files)
        const previews = []
        setSelectedImage(files)
        for (let i = 0; i < files.length; i++) {

            console.log("25", e.target)
            const reader = new FileReader()
            reader.onload = (e) => {
                previews.push(e.target?.result)
                if (previews.length === files.length) {
                    setImagePreview(previews)
                }
            }
            reader.readAsDataURL(files[i])
        }
        console.log("33", previews)
    }

    // const handleUpload = (event) => {
    //     event.preventDefault()
    //     const imagesArray = Object.values(selectedImage);
    //     console.log("41", imagesArray)

    //     if (imagesArray.length > 0) {
    //         const formData = new FormData();

    //         imagesArray.forEach((image, index) => {
    //             console.log("46", image[0])
    //             formData.append(`image${index + 1}`, image[0]);
    //         });

    //         const bearerToken = Cookies.get('token');

    //         if (!bearerToken) {
    //             console.error("Error: Bearer token is missing.");
    //         } else {
    //             fetch(`${API_URL}`, {
    //                 method: 'POST',
    //                 body: formData,
    //                 headers: {
    //                     'Authorization': `Bearer ${bearerToken}`
    //                 },
    //             })
    //                 .then((response) => response.json())
    //                 .then((data) => {
    //                     toast.success(data.message);
    //                 })
    //                 .catch((error) => {
    //                     toast.error(error.message);
    //                 });
    //         }
    //     } else {
    //         // Handle the case when no images are selected
    //         console.log("No images selected");
    //     }

    //     const bearerToken = Cookies.get('token');

    //     if (!bearerToken) {
    //         console.error("Error: Bearer token is missing.");
    //     } else {
    //         fetch(`${API_URL}`, {
    //             method: 'POST',
    //             body: formData,
    //             headers: {
    //                 'Authorization': `Bearer ${bearerToken}`
    //             },
    //         })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 toast.success(data.message);
    //             })
    //             .catch((error) => {
    //                 toast.error(error.message);
    //             });
    //     }
    // }
    const handleUpload = (event) => {
        event.preventDefault();
        const imagesArray = Object.values(selectedImage);
        console.log("41", imagesArray);

        if (imagesArray.length > 0) {
            const formData = new FormData();

            imagesArray.forEach((image, index) => {
                console.log("46", image[0]);
                formData.append(`image${index + 1}`, image);
            });

            const bearerToken = Cookies.get('token');

            if (!bearerToken) {
                console.error("Error: Bearer token is missing.");
            } else {
                fetch(`${API_URL}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${bearerToken}`
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        toast.success(data.message);
                        if (data?.result?.length > 0) {

                            data?.result.map((img) => {
                                console.log("127", img?.filename)
                                setFieldValue('images', img?.filename)
                            })
                        }
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    });
            }
        } else {
            // Handle the case when no images are selected
            console.log("No images selected");
        }
    };

    return (
        <div>
            <ToastContainer limit={1} theme='colored' autoClose={1000} />
            <div className="flex justify-start items-center flex-wrap  mb-2 block text-sm font-medium ">
                <p className="me-2 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px). <strong className='text-amber-300'>Click on below box for upload images</strong></p>
                {selectedImage?.length > 0 && <button onClick={handleUpload} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Upload
                </button>}
                {getFieldProps('images')?.value?.length > 0 && <button onClick={() => {
                    setFieldValue('images', '')
                    setSelectedImage([])
                }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Remove Image
                </button>}
            </div>
            <div className="flex items-center justify-center w-full">

                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    {/* {getFieldProps('images')?.value?.length === 0 && !selectedImage && < div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    </div>} */}

                    {/* <div className={selectedImage?.length > 2 ? `grid gap-6 mb-6 md:grid-cols-6 w-full` : 'w-full'}> */}
                    {/* {imagePreview &&
                        imagePreview.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`${index}`}
                                style={{ maxWidth: '100%', maxHeight: '30vh', margin: '5px' }}
                            />
                        ))} */}
                    {getFieldProps('images')?.value?.length > 0 && selectedImage?.length === 0 && (
                        <img
                            src={`http://localhost:5012/public/uploadImage/assets/${getFieldProps('images')?.value}`}
                            alt="Default"
                            style={{ maxWidth: '100%', maxHeight: '30vh', margin: '5px' }}
                        />
                    )}

                    {imagePreview && selectedImage?.length > 0 &&
                        imagePreview.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`${index}`}
                                style={{ maxWidth: '100%', maxHeight: '25vh', margin: '5px' }}
                            />
                        ))}
                    {/* </div> */}
                    <input id="dropzone-file" type="file" name={name} className="hidden" value={value} onChange={handleFileChange}
                        onBlur={onBlur} />

                </label>
            </div>

            {/* <input type='file' accept='image/*' multiple /> */}



            <div>



            </div>
        </div>
    )
}

export default ImageUpload
