import React from 'react';

const DeleteModel = ({
    showModal,
    hideModal,
    confirmModal,
    id,
    type,
    message,
    isLoading = false,
}) => {
    return (
        <div
            className={`fixed inset-0 ${showModal ? 'block' : 'hidden'
                } z-10 overflow-y-auto`}
        >
            <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                <div
                    className="fixed inset-0 transition-opacity"
                    onClick={hideModal}
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <div
                    className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${showModal ? 'sm:w-3/4' : 'sm:w-1/2'
                        }`}
                >
                    <div className="px-4 py-5 bg-white sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900">
                            Delete Confirmation
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            onClick={hideModal}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-400 text-base font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => confirmModal(id)}
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                                } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.586a8.966 8.966 0 011.414-1.414C7.938 16.755 9.954 17 12 17c1.185 0 2.327-.172 3.414-.486A8.966 8.966 0 0117.414 17H6z"
                                    ></path>
                                </svg>
                            ) : null}
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModel;
