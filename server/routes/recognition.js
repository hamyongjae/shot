const config = require('config');
const request = require('request');
const express = require('express');
const router = express.Router();


const cfr = require('../api/cfr');
const { setCelebrityCount }=require('../data_access/dbAction');


/* 얼굴 인식을 요청 받음. */
router.post('/', async (req, res) => {
    console.log(`${new Date().toLocaleString()} -> method post : /recognition  `);
    let img;

    if(!req.file){
        const imgUrl=req.body.image;
        img=await request.get(imgUrl);
    }
    else {
       img = req.file.buffer;
    }

    //api로 이미지를 전송하기 위해 formdata로 설정.
    const _formData = {
        image: 'image',
        image: img
    };
    console.log(config.faceRecognition.naverClova.url);
    
    //api로 전송.
    request.post({
        url: cfr.API_URL,
        formData: _formData,
        headers: {
            "X-Naver-Client-Id": cfr.CLIENT_ID,
            "X-Naver-Client-Secret": cfr.CLIENT_SECRET
        }
    }, (err, response, body) => {
        if(err) console.error(err.message);
        else if(response.statusCode===200){
            const name = JSON.parse(body).faces[0].celebrity.value;
            setCelebrityCount(name);
        }
    }).pipe(res);
})



module.exports = router;
