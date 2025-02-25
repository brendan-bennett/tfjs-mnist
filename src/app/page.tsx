"use client"
import Canvas from '../components/canvas';
import * as tf from '@tensorflow/tfjs'
import { useEffect, useState } from "react";

export default function Home() {
  const [model, setModel] = useState(null);
  const [about, setAbout] = useState(false);

  useEffect(() => {
    tf.loadLayersModel('/model.json').then((loadedModel) => {
      setModel(loadedModel);
      console.log("Model loaded successfully!");
    }).catch(err => {
      console.error("Error loading model:", err);
    });
  }, []);

  return (
    <section>
      <div className="prose prose-neutral dark:prose-invert text-center pb-10">
        Small project using TensorFlow.js to load a model trained on mnist data.
      </div>
      <div className="prose prose-neutral dark:prose-invert text-center">
        Draw a number!
      </div>
      <div className='container'>
        <Canvas model={model} />
      </div>
    </section>
  )
}
