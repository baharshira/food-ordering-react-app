import { useCallback, useEffect, useState } from 'react';


// A custom hook for dealing with HTTP requests and fetching data
async function sendHttpRequest(url, config) {
    const response = await fetch(url, config);

    // Parse the response data as JSON
    const resData = await response.json();

    // If the response status is not ok, throw an error with the message from the server or a default message
    if (!response.ok) {
        throw new Error(
            resData.message || 'Something went wrong, failed to send request.'
        );
    }

    // Return the parsed response data
    return resData;
}

export default function useHttp(url, config, initialData) {
    // State to hold the fetched data
    const [data, setData] = useState(initialData);

    // State to track loading status
    const [isLoading, setIsLoading] = useState(false);

    // State to handle errors
    const [error, setError] = useState();

    // Function to clear the fetched data
    function clearData() {
        setData(initialData);
    }

    // useCallback to memoize the sendRequest function
    // the sendRequest will re-render only on changing the url/config
    const sendRequest = useCallback(
        async function sendRequest(data) {
            setIsLoading(true);
            try {
                const resData = await sendHttpRequest(url, { ...config, body: data });
                // Update the state with the fetched data
                setData(resData);
            } catch (error) {
                // If an error occurs during the request, update the state with the error message
                setError(error.message || 'Something went wrong!');
            }
            // Set loading to false after the request is complete
            setIsLoading(false);
        },
        //  if neither url nor config changes between renders, the same memoized function reference will be reused, preventing unnecessary re-renders
        [url, config]
    );

    // The dependencies array contains the sendRequest and config, such that only when they change, the effect will rerun
    useEffect(() => {
        // Trigger a request only if the method is 'GET' or not specified in the config
        if ((config && (config.method === 'GET' || !config.method)) || !config) {
            sendRequest();
        }
    }, [sendRequest, config]);

    // Return the state and functions for use in the component
    return {
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    };
}