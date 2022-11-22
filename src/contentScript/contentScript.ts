// TODO: content script
import axios from "axios"

const sendCollectedData = async (data?: string): Promise<any> => {
    while(data && data.length < 45) {
        const _ = " ";
        data = data.concat(_);
    }
    chrome.storage.sync.get(['id'], async (res) => {
        const requestObject = {
            uuid: res.id,
            text: data
        }
        // const request = await axios.post("https://d552-217-147-224-178.eu.ngrok.io/api/v1/check_sensitivity", requestObject);
        // const response = await request.data;

        const response = {
            error: false,
            error_msg: null,
            data: {
                "sensitivity": {
                    "identity_attack": Math.floor(Math.random() * 30),
                    "insult": Math.floor(Math.random() * 50),
                    "obscene": Math.floor(Math.random() * 10),
                    "severe_toxicity": Math.floor(Math.random() * 50),
                    "sexual_explicit": Math.floor(Math.random() * 45),
                    "threat": Math.floor(Math.random() * 30),
                    "toxicity": Math.floor(Math.random() * 20)
                }
            }
        }
        
        if(response) {
            chrome.storage.sync.set({violations: response}, () => {
                chrome.runtime.sendMessage('set-response');
            });
        }
    });
}

const parsePage = () => {
    return new Promise((resolve, reject) => {
        let data = document.querySelectorAll("aside,span,header,footer,div,p,h1,h2,h3,h4,h5,h6,section") as any;
        let strings:string[] = [];
        data.forEach((e: any) => {
            if(e) strings.push(e.innerText);
        });
        let wholeString = strings.join(" ");
        if(data && strings.length > 0) {
            resolve(sendCollectedData(wholeString))
        } else reject("Couldn't parse webpage.");
    }
)};

parsePage();