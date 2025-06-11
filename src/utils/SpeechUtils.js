class SpeechUtils {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
    }

    speak(name) {
        // Stop any currently playing speech
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(name);
        utterance.lang = 'en-US'; // Changed from 'en-UK' to 'en-US' for better compatibility
        utterance.rate = 0.8; // Slightly slower for better clarity
        utterance.volume = 0.7; // Reduced volume to prevent overwhelming sound
        
        // Store reference to current utterance
        this.currentUtterance = utterance;
        
        // Clear reference when speech ends
        utterance.onend = () => {
            this.currentUtterance = null;
        };
        
        // Handle errors
        utterance.onerror = (event) => {
            console.warn('Speech synthesis error:', event.error);
            this.currentUtterance = null;
        };
        
        // Speak the utterance
        this.synthesis.speak(utterance);
    }

    // Method to stop current speech
    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.currentUtterance = null;
    }

    // Method to check if currently speaking
    isSpeaking() {
        return this.synthesis.speaking;
    }
}

export default new SpeechUtils();