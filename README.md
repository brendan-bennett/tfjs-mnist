## Getting Started

First, run:

```bash
npm i
```
I highly suggest creating a python virtual env to help manage package dependencies.

Then,


```bash
 pip install -r requirements.txt

 python main.py  
```

That should create your model: model.h5.

Then convert it to a tfjs model type:

```bash
tensorflowjs_converter \
    --input_format=keras \
    --output_format=tfjs_layers_model \
    ./model.h5 \
    ./public
```

Finally, 
```bash
npm run dev
```

And if that all worked correctly, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

