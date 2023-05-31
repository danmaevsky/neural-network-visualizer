import { useState } from "react";
import "./TutorialCards.css";
import brainImg from "./Brain.svg";
import networkIcon from "./ControlBar/NavBar/logo.svg";
import NavbarScreenshot from "../resources/NavbarScreenshot.png";
import MLPLayerInfoBox from "../resources/MLPLayerInfoBox.png";
import CNNLayerInfoBox from "../resources/CNNLayerInfoBox.png";
import VisualizeButton from "../resources/VisualizeButton.png";
import NeuronInfoBox from "../resources/NeuronInfoBox.png";
import SynapseInfoBox from "../resources/SynapseInfoBox.png";
import FilterInfoBox from "../resources/FilterInfoBox.png";
import RedFilter from "../resources/RedFilter.svg";
import GreenFilter from "../resources/GreenFilter.svg";
import BlueFilter from "../resources/BlueFilter.svg";

class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  put(data) {
    if (this.first === null) {
      this.first = new LinkedListNode(data);
      this.last = this.first;
      this.size++;
    } else if (this.last !== null) {
      this.last.next = new LinkedListNode(data);
      this.last.next.prev = this.last;
      this.last = this.last.next;
    }
  }
}

class LinkedListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

let cardList = new LinkedList();
cardList.put(<WelcomeCard />);
cardList.put(<Card1 />);
cardList.put(<Card2 />);
cardList.put(<Card3 />);
cardList.put(<Card4 />);
cardList.put(<Card5 />);
cardList.put(<Card6 />);
cardList.put(<AcknowledgementsCard />);
export function TutorialCards(props) {
  const toggleShowTutorial = props.toggleShowTutorial;
  const [currCard, setCurrCard] = useState(cardList.first);

  return (
    <div className="tutorialCards">
      {currCard.data}
      <div className="tutorialCardButtons">
        <button className="skipTutorialButton" onClick={() => toggleShowTutorial(false)}>
          Skip Tutorial
        </button>
        {currCard.prev !== null ? (
          <button className="prevButton" onClick={() => setCurrCard(currCard.prev)}>
            Previous
          </button>
        ) : null}
        {currCard.next !== null ? (
          <button className="nextButton" onClick={() => setCurrCard(currCard.next)}>
            Next
          </button>
        ) : (
          <button className="exitButton" onClick={() => toggleShowTutorial(false)}>
            Exit
          </button>
        )}
      </div>
    </div>
  );
}

function WelcomeCard() {
  return (
    <div className="tutorialWelcomeCard">
      <h1 className="tutorialHeader">Welcome to the Neural Network Visualizer!</h1>
      <img src={brainImg} alt="Brain Icon" />
      <p className="tutorialWelcomeCardParagraph1">
        These cards will give you the rundown about how to use this app, as well as some background into artificial neural networks.
      </p>
      <p className="tutorialWelcomeCardParagraph2">
        If you just want to get started, feel free to press the "Skip Tutorial" button below. To re-open the tutorial, you can click the three bars at
        the top and select "Show Tutorial".
      </p>
    </div>
  );
}

function Card1() {
  return (
    <div className="tutorialCard1">
      <h1 className="tutorialHeader">What is a Neural Network?</h1>
      <p className="tutorialCard1Paragraph1">
        A neural network is one specific class of Machine Learning algorithms. Machine Learning algorithms are any algorithms that can look at data
        and help somebody draw conclusions. Even a simple linear regression is one type of Machine Learning algorithm that can help make inferences!
      </p>
      <p className="tutorialCard1Paragraph2">
        Neural networks are, as you'd expect, more complex than linear regressions. They utilize the tools of multivariate calculus, linear algebra,
        and statistics to build an incredibly effective and adept framework that can be applied to solve all kinds of problems, from analyzing data
        about spending to image classification and voice recognition.
      </p>
      <img src={networkIcon} alt="Neural Network Icon" />
    </div>
  );
}

function Card2() {
  return (
    <div className="tutorialCard2">
      <h1 className="tutorialHeader">Types of Neural Networks</h1>
      <p className="tutorialCard2Paragraph1">
        There are a <b>lot</b> of different kinds of neural networks out there, each one best suited for different task, and the research done into
        inventing new or modifying existing types is some of the most well-funded research in the entire world. Here are just a few:
      </p>
      <div className="tutorialCard2NetworkList">
        <div className="tutorialCard2NetworkListItem">
          <p>
            <b>Multilayer Perceptrons</b>
          </p>
          <p>
            The simplest neural network, consisting of layers of neurons feeding forward and processing information. The input layer takes in all the
            data concurrently, meaning it is incapable of effectively utilizing the spacial or temporal information encoded in the data (such as in
            images and time series).
          </p>
        </div>
        <div className="tutorialCard2NetworkListItem">
          <p>
            <b>Convolutional Neural Networks</b>
          </p>
          <p>
            A type of neural network designed to deal with the MLPs' inability to handle spacial information. These consist of stacks of filters that
            glide across the surface of images (and other data where space is crucial), processing spacial subsets of the data before passing it
            along.
          </p>
        </div>
        <div className="tutorialCard2NetworkListItem">
          <p>
            <b>Recurrent Neural Networks</b>
          </p>
          <p>
            A type of neural network designed to deal with the MLPs' inability to handle temporal information. These are essentially MLPs, with the
            big difference being that they feed their own previous outputs <b>back into themselves</b> as inputs when they process the next piece of
            information.
          </p>
        </div>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="tutorialCard3">
      <h1 className="tutorialHeader">What This App Does</h1>
      <p className="tutorialCard3Paragraph1">
        This app lets you take a closer look inside Neural Networks by creating a visual model for them. You'll be able to watch as Forward and
        Backward Propagation happens, inspect each individual weight—alone meaning very little but together compounding into the complexity that makes
        these tools so powerful—and you'll also be able to train your own, small Neural Networks and see the predictions they come up with!
      </p>
      <p className="tutorialCard3Paragraph2">
        You can tune many <b>hyperparameters</b>, such as the Activation Function, how many hidden layers, and more!
      </p>
      <p className="tutorialCard3Paragraph3">
        Start by selecting a Preset from the Presets dropdown menu to use a fully trained model for classification, or by choosing a Dataset and
        Algorithm if you want to train your own! From this bar, you can also select a Visualization Speed as well as Reset the app.
      </p>
      <img src={NavbarScreenshot} alt="Navbar Screenshot"></img>
    </div>
  );
}

function Card4() {
  return (
    <div className="tutorialCard4">
      <h1 className="tutorialHeader">Tuning Hyperparameters</h1>
      <p className="tutorialCard4Paragraph1">
        If you opt to select a Dataset and Algorithm to use, you can start adding Layers. Whenever you add a new Layer, you'll see some options appear
        on the right. You can always click on a Layer to get back to this menu.
      </p>
      <div className="tutorialCard4InfoBoxes">
        <img src={MLPLayerInfoBox} alt="Multilayer Perceptron Info Box Screenshot"></img>
        <img src={CNNLayerInfoBox} alt="Convolutional Neural Net Info Box Screenshot"></img>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="tutorialCard5">
      <h1 className="tutorialHeader">Understanding the Hyperparameters</h1>
      <p className="tutorialCard5Paragraph1">
        You can choose how many Neurons/Filters you have in the Layer, which directly corresponds to the complexity of the network. You can also
        choose the Activation Function of the Layer, which is the mathematical function that the Neurons use to process their inputs. The industry
        standard right now is ReLU but there are so many options so please play around with them and see what kind of results you get!
      </p>
      <img className="tutorialCard5RedFilter" src={RedFilter} alt="Red Filter" />
      <img className="tutorialCard5GreenFilter" src={GreenFilter} alt="Green Filter" />
      <img className="tutorialCard5BlueFilter" src={BlueFilter} alt="Blue Filter" />
      <p className="tutorialCard5Paragraph2">
        In CNN models, you can also change the filter size, varying it from 4x4 to 6x6. The limits are there to prevent filtering the whole image out
        of existence (look into the "Output Size of Convolution Formula" for more details)!
      </p>
    </div>
  );
}

function Card6() {
  return (
    <div className="tutorialCard6">
      <h1 className="tutorialHeader">Visualizing and Viewing Learned Parameters</h1>
      <p className="tutorialCard6Paragraph1">
        Once you're done configuring your model, click the orange "Visualize" button and watch as your model learns to classify the Dataset you
        selected!
      </p>
      <img className="tutorialCard6VisualizeButton" src={VisualizeButton} alt="Visualize Button Screenshot" />
      <p className="tutorialCard6Paragraph2">You can click on individual Neurons/Filters to view details about them.</p>
      <p className="tutorialCard6Paragraph3">
        When using a Multilayer Perceptron Network, you can also view information about a specific Synapse by shift-clicking the left-Neuron and the
        right-Neuron of the Synapse. When using a Convolutional Neural Network, you can view information about a specific weight by clicking on a tile
        after clicking on a filter.
      </p>
      <div className="tutorialCard6InfoBoxes">
        <img className="tutorialCard6NeuronInfoBox" src={NeuronInfoBox} alt="Neuron Info Box Screenshot" />
        <img className="tutorialCard6SynapseInfoBox" src={SynapseInfoBox} alt="Synapse Info Box Screenshot" />
        <img className="tutorialCard6FilterInfoBox" src={FilterInfoBox} alt="Filter Info Box Screenshot" />
      </div>
    </div>
  );
}

function AcknowledgementsCard() {
  return (
    <div className="AcknowledgementsCard">
      <h1 className="tutorialHeader">Enjoy!</h1>
      <p className="acknowledgementsCardParagraph1">
        Enjoy messing around with this app! It was a blast for me to make and I hope you enjoy using it. My goal with building this project was to
        demystify the aura around Neural Networks. Especially with recent news about a potentially "conscious" AI, I wanted to build this project to
        teach people that Neural Networks as they are now are simply mathematical functions, albeit pretty complicated, non-linear ones.
      </p>
      <p className="acknowledgementsCardParagraph2">
        There is so much to learn about Deep Learning and artificial intelligence! Here is a list of some really good resources I found while
        researching:
      </p>
      <ul className="acknowledgementsCardResourcesList">
        <li>
          <a href="https://youtube.com/playlist?list=PL3FW7Lu3i5JvHM8ljYj-zLfQRF3EO8sYv">Stanford Series on Convolutional Neural Networks</a> - Great
          Material on MLPs, CNNs, and more. Definitely start here!
        </li>
        <li>
          <a href="https://www.sciencedirect.com/topics/computer-science/multilayer-perceptron">Science Direct Catalogue - Multilayer Perceptrons</a>
        </li>
        <li>
          <a href="https://ieeexplore.ieee.org/document/8966288">Fast 2D Convolution Algorithms for Convolutional Neural Networks</a>
        </li>
      </ul>
    </div>
  );
}
