'use strict';

const express = require('express');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const path = require('path');

const router = express.Router();

// Load face-api.js models
const MODEL_URL = path.join(__dirname, '/models');

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
]).then(() => console.log('Models Loaded'));

// Face recognition endpoint
router.post('/recognize', async (req, res) => {
    const { image } = req.body; // Expecting an image in the request

    // Process the image with face-api.js
    const img = await canvas.loadImage(image);
    const results = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    res.json({ results });
});

// Face matching endpoint
router.post('/match', async (req, res) => {
    const { image1, image2 } = req.body; // Expecting two images in the request

    const img1 = await canvas.loadImage(image1);
    const img2 = await canvas.loadImage(image2);

    const descriptors1 = await faceapi.detectSingleFace(img1).withFaceLandmarks().withFaceDescriptor();
    const descriptors2 = await faceapi.detectSingleFace(img2).withFaceLandmarks().withFaceDescriptor();

    if (descriptors1 && descriptors2) {
        const distance = faceapi.euclideanDistance(descriptors1.descriptor, descriptors2.descriptor);
        res.json({ distance });
    } else {
        res.status(400).json({ error: 'Face not detected in one or both images.' });
    }
});

module.exports = router;
