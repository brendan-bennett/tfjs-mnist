"use client"
import { useState } from 'react'
import { useDraw } from '../hooks/use-draw'
import * as tf from '@tensorflow/tfjs'
import { Trash, RotateCcw, ScanEye } from 'lucide-react';

export default function Canvas({ model }) {
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine)
  const [prediction, setPrediction] = useState(null)
  const [image, setImage] = useState<string | undefined>(undefined);

  function drawLine({ prevPoint, currentPoint, ctx }) {
    const { x: currX, y: currY } = currentPoint
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth

    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  async function handlePredict() {
    if (!model || !canvasRef.current) {
      alert("Model not loaded yet!");
      return;
    }

    const newCanvas = document.createElement('canvas')!;
    const newContext = newCanvas.getContext("2d")!;

    newCanvas.width = 28;
    newCanvas.height = 28;
    newContext.drawImage(canvasRef.current, 0, 0, 28, 28);

    let tmp = [];
    const data = [];
    const image = newContext.getImageData(0 ,0 , 28, 28);

    setImage(newCanvas.toDataURL('image/png'));

    for (let p= 0; p < image.data.length; p+= 4) {
      const value = image.data[p + 3] / 255;
      tmp.push([value]);

      if (tmp.length === 28) {
        data.push(tmp);
        tmp = [];
      }
    }

    if (!model) return

    const tensor = tf.tensor4d([ data ]);
    
    const predictions = (model.predict(tensor) as tf.Tensor<tf.Rank>).dataSync();
    const predictedClass = predictions.indexOf(Math.max(...predictions))
    setPrediction(predictedClass)
  }

  async function clearPredict() {
    setPrediction(null);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        width={350}
        height={350}
        className="bg-white border border-black rounded-lg"
      />
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            className="border border-black rounded-lg px-4 py-2"
            onClick={() => { clear(); clearPredict(); }}
          >
            Reset
          </button>
          <button
            type="button"
            className="border border-black rounded-lg px-4 py-2"
            onClick={handlePredict}
          >
            Predict
          </button>
        </div>
        {/* Larger Prediction display */}
        <div className="border border-black rounded-lg px-4 py-2 text-center">
          Prediction: {prediction !== null ? prediction : "-"}
        </div>
      </div>
    </div>
  )
  
  
}
