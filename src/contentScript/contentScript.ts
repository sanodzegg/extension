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
        // const request = await axios.post("https://e1c4-212-58-103-210.eu.ngrok.io/api/v1/check_sensitivity", requestObject);
        // const response = await request.data;
        const response = {
            error: false,
            error_msg: null,
            data: {
                "sensitivity": {
                    "identity_attack": 34,
                    "insult": 79,
                    "obscene": 100,
                    "severe_toxicity": 47,
                    "sexual_explicit": 98,
                    "threat": 3,
                    "toxicity": 12
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