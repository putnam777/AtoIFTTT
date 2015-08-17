# AtoIFTTT

AtoIFTTT is short for "Alexa to If-this-then-that"; it's a simple [AWS Lambda] that packages up an [Alexa Skills Kit] Intent along with up to three "slot" values and sends them via a Web Request as an input to a "recipe" using the IFTTT [Maker Channel].

##Why IFTTT?
This approach is convenient for two major reasons :

1. Allows for custom IFTTT events to be launched launched without any additional coding / intent setup
2. It opens up any IFTTT Channel with a Action on it as a potential "tool" for Alexa. 

##Getting Started with AtoIFTTT
(Note: If you haven't created an Alexa Skills Kit Lambda before, it's best to read "[Developing an Alexa Skill as a Lambda Function]" first to familiarize yourself with the process. You should also be familiar with the basic workings of [IFTTT])

1. If you aren't already a member, [join] IFTTT.
2. Enable the [Maker Channel] on your account.
3. When you view the Maker Channel in your account, you'll see a string labeled "Your secret key is:".  Note this string and save it for step 5.
4. Using the code in "index.js", follow the instructions for [Creating a Lambda Function for an Alexa Skill], using the "index.js" code rather than the template code.
5. Near the top of the file, find the string "YOUR_IFTTT_MAKER_SECRET_HERE". Replace this string with your private key from step 3.
6. Follow the remaining steps to finish creating the Lambda function and, most importantly, assigning a basic execution Role in order to allow the Alexa skill to make use of the Lambda.
7. Once you've saved the Lambda and go back to the "Function List" page, you'll see your Lambda listed and below it, the label "Function ARN" followed by a string starting with "arn:" (e.g., "arn:aws:lambda:us-east-1:201599999999:function:Function-Name".  Take note of this as you'll need it to tell your Alexa Skill what function to call.

That's it!  You're now ready to use IFTTT with Alexa! However, you'll probably benefit from a couple of examples of how to use IFTTT to prototype new Alexa Skills... if so, read on.

##Examples

"Alexa, Tell INVOCATION_NAME to test this"
    -Passes "testthis" to ifttt maker channel
    
[join]:https://ifttt.com/join
[AWS Lambda]:http://aws.amazon.com/lambda
[Alexa Skills Kit]:https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit
[Maker Channel]:https://ifttt.com/maker
[Developing an Alexa Skill as a Lambda Function]:https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function
[IFTTT]:https://www.ifttt.com
[Creating a Lambda Function for an Alexa Skill]:https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function#Creating%20a%20Lambda%20Function%20for%20an%20Alexa%20Skill
[Phone Call Channel]:https://ifttt.com/phone_call
[SMS Channel]:https://ifttt.com/sms
[Alexa "FindMyPhoneIntent"]:https://ifttt.com/recipes/304080-alexa-findmyphoneintent
[Alexa "TextIntent"]:https://ifttt.com/recipes/304081-alexa-textintent
[Testing a Lambda Function with an Echo]:https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function#Testing%20a%20Lambda%20Function%20with%20an%20Echo

