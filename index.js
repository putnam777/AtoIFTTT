/*
****** Pulls speech input and passes on to IFTTT Maker Channel for custom events *****
*/
// Use commands like "Alexa, ask 'INVOCATION_NAME_HERE' to set hue lights to green." This script will parse 'set hue lights' as
// the event trigger, and 'green' as 'value1' as a json body. You can also make simpler requests like, "Alexa, ask 'INVOCATION_NAME_HERE'
// to  turn lights off."
var https = require('https');

var iftttMakerKey = "INSERT_YOUR_MAKER_KEY_HERE";

exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);


//        if (event.session.application.applicationId !== "YOUR_AMAZON_APP_ID_HERE") {
//             context.fail("Invalid Application ID");
//         }


        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;
        
    // Whatever the Intent is, pass it straight through to 
    // IFTTT 
    
    callIFTTT(intent, session, callback);

}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Main Intent Processing Function ----------------


function callIFTTT(intent, session, callback)
{
    var sessionAttributes = "{}";
    var cardTitle = intent.name;
    var shouldEndSession = true;

    var payload = "";
    var speechOutput = "";
    var repromptText = "Please pass parameters for the " + intent.name + " intent";
    var i = 0;
    var slots = intent.slots;
   
   // The variable setSplit is intended to split the command into two parts. This only works if you use the word 'to' in your command.
   // This code below setSplit removes all spacing between letters.
   // The command is actually split 3 times. setSplit1 is meant to keep the spacing intact so that Alexa makes sense when she responds.
   // See line #s 158 to 161 for reference.
   // setSplit2 is going to be used as 'value1' as a json body for the Maker Channel. Visit https://ifttt.com/maker for more details.
    var actionSlot = intent.slots.Action;
    var setSplit = actionSlot.value.split(" to")[0];
    setSplit = setSplit.replace(/\s+/g, '');
    var setSplit1 = actionSlot.value.split(" to")[0];
    var setSplit2 = actionSlot.value.split("to ")[1];
    
    // Form the request, using the Intent value as the Event for the channel
    var path = "/trigger/"+setSplit+"/with/key/"+iftttMakerKey;
    
    console.log("callIFTTT - Intent name = " + intent.name);
    
    // Simpler code than the original from **monty617** in order to pass a value forward as a json body to the maker channel.
    // Due to my lack of coding knowledge, this may be a bit messy, yet it still works!
    
    var jsonBody = { "value1": setSplit2};
    var key;
    var value;
    payload = JSON.stringify(jsonBody);
    
    console.log("callIFTTT - payload = " + payload);
    
    // Options indicating where we should send the request to. The 'data' portion below has been added to pass along the json body.
    // The original code fuctioned differently.
    
        var post_options = {
        host: 'maker.ifttt.com',
        port: '443',
        path: path,
        method: 'POST',
        data: jsonBody,
        headers: {
          'Content-Type': 'application/json'
        }
    };
  
    console.log("Sending request to " + post_options.host + ":" + post_options.port + post_options.path + post_options.data);
    // Set up the request
    var post_req = https.request(post_options, function(res) {
        var stringResult = "";
		console.log('callifttt - STATUS : ' + res.statusCode);
		console.log('callifttt - HEADERS : ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
        res.on('data', function (chunk) {
            stringResult += chunk;
        });
        res.on('end', function () {
        console.log("result = "+stringResult);
        // With a simple command like "turn lights off," Alexa will respond with the 1st option below. With a command like, "set hue
        // lights to green," Alexa will respond with the 2nd option. This way the response is more natural, and can assist with
        // debugging if needed.
        if (setSplit2 === undefined)
		    speechOutput = "OK, I "+setSplit1+", using I-F-T-T-T";
		else
		    speechOutput = "OK, I "+setSplit1+" to "+setSplit2+" using I-F-T-T-T";
        callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)); //Pass stingResult instead of speechOutput for debugging if needed
        });
    });
    post_req.on('error', function (e) {
        console.log(e);
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
    //post the data
    post_req.write(payload);
    post_req.end();
    
}

// --------------- WelcomResponse Function ----------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput=null;
    var shouldEndSession = false;
    //
    // Make sure the key is initialized
    //
    if (myMakerKey == "INSERT_YOUR_MAKER_KEY_HERE") {
        speechOutput = "Please edit the Lambda to specify your secret Maker Key before making a request.";
        shouldEndSession = true;
    }
    else {
        speechOutput = "Please state your command.";
    }
    
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please state one of the commands that the Intent Model is designed to process.  I'm sorry that I can't be more specific.";

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helper Functions ----------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
