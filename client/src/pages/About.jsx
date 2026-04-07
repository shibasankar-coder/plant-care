import React from 'react';
import { Leaf, Heart } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-sm mt-8">
            <div className="text-center mb-12">
                <Leaf className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    About Plant Care Reminder
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Nurturing your green friends, one drop at a time.
                </p>
            </div>

            <div className="prose prose-emerald prose-lg mx-auto text-gray-600">
                <p>
                    Welcome to Plant Care Reminder, your ultimate companion in cultivating a thriving indoor garden. 
                    We believe that everyone has an inner green thumb waiting to be discovered, and our mission 
                    is to provide you with the tools and knowledge to make your plant parenting journey a success.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Story</h2>
                <p>
                    Born from a passion for botanical beauty and a desire to simplify plant maintenance, 
                    Plant Care Reminder was developed with Love by Dharma and Shiba. We understand that keeping track of 
                    watering schedules, sunlight requirements, and specific care instructions can be overwhelming, 
                    especially for busy individuals.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do</h2>
                <p>
                    Our application empowers you to:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Create a personalized digital catalog of your entire plant collection.</li>
                    <li>Set and receive timely reminders for watering, ensuring your plants never go thirsty.</li>
                    <li>Log essential details about each plant, from its species to its specific needs.</li>
                    <li>Track the growth and health of your plants through a simple, intuitive interface.</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Vision</h2>
                <p>
                    We envision a world where every home is a green oasis, where the air is cleaner, and where 
                    the therapeutic benefits of tending to plants are accessible to all. Join us in making 
                    the world a little greener, one leaf at a time.
                </p>

                <div className="mt-12 text-center text-emerald-600 flex items-center justify-center font-medium">
                    <span>Keep growing with us!</span>
                    <Heart className="w-5 h-5 ml-2 fill-emerald-600" />
                </div>
            </div>
        </div>
    );
};

export default About;
