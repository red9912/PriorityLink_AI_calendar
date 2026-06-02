const URL = "http://localhost:3001/";

async function rasaParse(message) {

   const messageToSend = {
        "message" : message 
    }

    const request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(messageToSend),
    }

    try {
        const response = await fetch(
            `${URL}api/sendMessage`,
            request
        );

        const data = await response.json();
        console.log(data)
        if (response.ok) {
            return data;
        } else {
            throw new Error("Failed to communicate with Rasa");
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while communicating with Rasa");
    }
}

async function getCommitments() {
    try {
        const response = await fetch(`${URL}api/commitments`);
        const json = await response.json();
        if (response.ok) {

            const commitments = json.map((event) => {
                return {
                    text: event.category,
                    startDate: parseDateTimeString(event.startDateTime),
                    endDate: parseDateTimeString(event.endDateTime),
                    description: event.name,
                    type: getCategory(event.category),
                    recurrenceRule: getRecurrency(event.recurrency)
                };
            })
            return commitments;
        }
    } catch (error) {
        throw error;
    }
}

function parseDateTimeString(string) {
    if (!string) return null;
    const [date, time] = string.split('T');
    const [year, month, day] = date.split('-')
    const [hours, minutes, seconds] = time.split(':');
    const period = new Date(year, month - 1, day, hours, minutes, 0)
    return period;
}

function getRecurrency(recurrency){
    if (recurrency === 'WEEKLY')
        return 'FREQ=WEEKLY;UNTIL=20251203'
    else if (recurrency === 'MONTHLY')
        return 'FREQ=MONTHLY;UNTIL=20251203'
}

function getCategory(category) {
    if (category === 'Work') {
        return 1
        //return '#011f4b'; 
    } else if (category === 'Study') {
        return 2;
    } else if (category === 'Free-time') {
        return 3;
    }
}

async function createNewCommitment(newCommitmentData) {
    try {
        const response = await fetch(
            `${URL}api/newcommitment}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCommitmentData),
            }
        );

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error(error);
            throw new Error("Failed to insert commitment");
        }
    } catch (error) {
        console.error(error);
        throw new Error("An error occurred while adding the commitment");
    }
}

async function updateCommitment(commitmentId, updatedData) {
    try {
        const response = await fetch(
            `${URL}api/updatecommitment/${commitmentId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ updatedData }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error updating commitment`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function deleteCommitment(commitmentId) {
    try {
        const response = await fetch(
            `${URL}api/deletecommitment/${commitmentId}`,
            {
                method: "DELETE",
            }
        );

        if (!response.ok) {
            throw new Error(`Error deleting commitment`);
        }
    } catch (error) {
        throw error;
    }
}


const API = {
    getCommitments,
    createNewCommitment,
    updateCommitment,
    deleteCommitment,
    rasaParse
};

export default API;