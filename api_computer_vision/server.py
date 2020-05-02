import cv2
modelTxt = "dnn.prototxt"
modelBin = "dnn.caffemodel"
net = cv2.dnn.readNetFromCaffe(modelTxt, modelBin)

def getMaxClass(probBlob):
        '''
        DNN support function
        '''
        _, classProb, _, classNumber = cv2.minMaxLoc(probBlob)
        classId = classNumber[0]
        return classId, classProb

def readClassNames(filename = "synset_words.txt"):
        '''
        DNN support function
        '''
        try:
            fp = open(filename)
        except:
            print("File with Classes labels not found: " + filename)
            return -1
        classNames = []
        for line in fp:
            classNames.append(line[line.find(' ')+1:])
        fp.close()
        return classNames
    
def dnn(frame):
        '''
        Applies googlenet onto a window
        '''
        #print(frame)
        img = cv2.resize(frame, (224,224), interpolation = cv2.INTER_CUBIC)
        if(img is None):
            return
        inputBlob = cv2.dnn.blobFromImage(img, 1.0, (224,224),(104,117,123),False)
        t = cv2.TickMeter()
        t.start()
        net.setInput(inputBlob, "data")
        prob = net.forward("prob")
        t.stop()
        classId,_ = getMaxClass(prob)
        classNames = readClassNames()
        print(classNames[classId].rstrip())
        return classNames[classId].rstrip()


#Server

from flask import Flask, request
from flask_cors import CORS, cross_origin
import numpy as np
app = Flask(__name__)
CORS(app)

@app.route('/')
@cross_origin()
def resp():
    return 'OK'


@app.route("/identify", methods=['POST'])
@cross_origin()
def response():
    file = None
    if not request.get_data():
        return 'empty'
    # print(request.files['file'])
    # print(request.get_data()[200])
    file = cv2.imdecode(np.asarray(bytearray(request.get_data())),1)
    if file is not None: return dnn(file)
    return 'Fail'
app.run()

