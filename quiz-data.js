const QUIZ_LEVELS = [
    {
        name: "Little Devotee",
        seconds: 20,
        questions: [
            {
                question: "Who are Lord Ganesha's parents?",
                options: ["Vishnu and Lakshmi", "Shiva and Parvati", "Brahma and Saraswati", "Indra and Sachi"],
                answer: "Shiva and Parvati",
                explain: "Ganesha is the son of Shiva and Parvati."
            },
            {
                question: "What animal head does Ganesha have?",
                options: ["Lion", "Elephant", "Tiger", "Bull"],
                answer: "Elephant",
                explain: "Ganesha is known as the elephant-headed god."
            },
            {
                question: "Which sweet is Ganesha's favorite offering?",
                options: ["Jalebi", "Rasgulla", "Modak", "Gulab jamun"],
                answer: "Modak",
                explain: "Modak is the sweet most closely linked with Ganesha."
            },
            {
                question: "Ganesha is especially worshipped as the remover of what?",
                options: ["Darkness", "Obstacles", "Rain", "Silence"],
                answer: "Obstacles",
                explain: "He is Vighnaharta, the remover of obstacles."
            },
            {
                question: "What is Ganesha's vehicle (vahana)?",
                options: ["A peacock", "A mouse", "A swan", "An eagle"],
                answer: "A mouse",
                explain: "His vahana is Mushika, the mouse."
            },
            {
                question: "Ganesh Chaturthi mainly celebrates Ganesha's what?",
                options: ["Wedding", "Victory in war", "Birth / arrival", "Journey to the Himalayas"],
                answer: "Birth / arrival",
                explain: "The festival marks Ganesha's birth and his coming home."
            },
            {
                question: "Which of these is another popular name for Ganesha?",
                options: ["Kartikeya", "Hanuman", "Ganapati", "Surya"],
                answer: "Ganapati",
                explain: "Ganapati and Vinayaka are well-known names of Ganesha."
            },
            {
                question: "Devotees often begin new work after first praying to whom?",
                options: ["Ganesha", "Agni only", "Varuna only", "Kubera only"],
                answer: "Ganesha",
                explain: "He is worshipped first as the lord of beginnings."
            }
        ]
    },
    {
        name: "Festival Friend",
        seconds: 16,
        questions: [
            {
                question: "What is the immersion of the Ganesha idol called?",
                options: ["Aarti", "Visarjan", "Homa", "Pradakshina"],
                answer: "Visarjan",
                explain: "Visarjan is the farewell immersion of the murti."
            },
            {
                question: "Public Ganeshotsav in Maharashtra was popularized by whom?",
                options: ["Mahatma Gandhi", "Lokmanya Tilak", "Swami Vivekananda", "Shivaji Maharaj"],
                answer: "Lokmanya Tilak",
                explain: "Tilak helped turn it into a large public festival around 1893."
            },
            {
                question: "Eco-friendly Ganesha idols are preferably made of what?",
                options: ["Plaster of Paris only", "Plastic", "Clay", "Cement"],
                answer: "Clay",
                explain: "Clay (shaadu mati) dissolves more cleanly in water."
            },
            {
                question: "Which grass is a traditional offering to Ganesha?",
                options: ["Tulsi only", "Durva", "Mint", "Bamboo leaves"],
                answer: "Durva",
                explain: "Durva grass is a classic offering in Ganesha puja."
            },
            {
                question: "How long does a typical Ganeshotsav celebration last in many cities?",
                options: ["One afternoon only", "About 10 days", "A full year", "Exactly 40 days"],
                answer: "About 10 days",
                explain: "Many public celebrations run about ten days until visarjan."
            },
            {
                question: "In many homes, a special number of modaks offered is:",
                options: ["2", "7", "21", "1008"],
                answer: "21",
                explain: "Twenty-one modaks are a traditional offering in several homes."
            },
            {
                question: "The last-day visarjan in many Maharashtrian celebrations falls on:",
                options: ["Diwali", "Anant Chaturdashi", "Holi", "Makar Sankranti"],
                answer: "Anant Chaturdashi",
                explain: "Anant Chaturdashi is when many idols are immersed."
            },
            {
                question: "Ganesh Chaturthi is especially grand in which Indian state?",
                options: ["Punjab", "Maharashtra", "Sikkim", "Nagaland"],
                answer: "Maharashtra",
                explain: "Mumbai, Pune and all of Maharashtra are famous for Ganeshotsav."
            }
        ]
    },
    {
        name: "Modak Scholar",
        seconds: 13,
        questions: [
            {
                question: "According to popular legend, Ganesha's elephant head was placed after what event?",
                options: ["A river flood", "Shiva beheaded him in anger", "A war with Ravana", "A yajna fire"],
                answer: "Shiva beheaded him in anger",
                explain: "Parvati created him; Shiva later restored him with an elephant head."
            },
            {
                question: "Why is Ganesha often shown with a broken tusk?",
                options: ["It fell in a dance", "He used it as a pen to write the Mahabharata", "It was a royal fashion", "It holds a diya"],
                answer: "He used it as a pen to write the Mahabharata",
                explain: "As Ekadanta, he broke a tusk to write Vyasa's Mahabharata."
            },
            {
                question: "Ganesha's brother, the warrior son of Shiva and Parvati, is:",
                options: ["Hanuman", "Kartikeya (Skanda)", "Nandi", "Garuda"],
                answer: "Kartikeya (Skanda)",
                explain: "Kartikeya, also called Skanda or Murugan, is his brother."
            },
            {
                question: "The name 'Ekadanta' means Ganesha has:",
                options: ["One tusk", "One eye", "One trunk curve", "One festival"],
                answer: "One tusk",
                explain: "Ekadanta refers to his single complete tusk."
            },
            {
                question: "Ganesha Chaturthi is observed on the fourth lunar day of which fortnight?",
                options: ["Krishna Paksha of Kartik", "Shukla Paksha of Bhadrapada", "Shukla Paksha of Chaitra", "Krishna Paksha of Magha"],
                answer: "Shukla Paksha of Bhadrapada",
                explain: "It falls on Bhadrapada Shukla Chaturthi."
            },
            {
                question: "Which of these is a well-known form-name of Ganesha?",
                options: ["Vakratunda", "Trinetra-only Shiva", "Panchajanya", "Sudarshana"],
                answer: "Vakratunda",
                explain: "Vakratunda, Lambodara and Ekadanta are Ganesha names."
            },
            {
                question: "In Ganesha iconography, a large belly (Lambodara) is said to hold:",
                options: ["Only sweets from one village", "The universe / all existence", "Rain clouds", "Temple bells"],
                answer: "The universe / all existence",
                explain: "Lambodara symbolizes holding the cosmos within."
            },
            {
                question: "Siddhi Vinayak in Mumbai is famous for a trunk that turns which way?",
                options: ["Straight up only", "To the left", "Into a spiral of 21 turns", "Hidden inside the crown"],
                answer: "To the left",
                explain: "The Siddhivinayak murti is a left-trunk (vaamamukhi) form."
            }
        ]
    },
    {
        name: "Temple Champion",
        seconds: 11,
        questions: [
            {
                question: "Ashtavinayak refers to how many sacred Ganesha temples in Maharashtra?",
                options: ["4", "8", "12", "24"],
                answer: "8",
                explain: "Ashta means eight — eight self-existent Ganesha shrines."
            },
            {
                question: "Which temple is traditionally the first in the Ashtavinayak pilgrimage?",
                options: ["Siddhatek", "Morgaon (Mayureshwar)", "Ranjangaon", "Mahad"],
                answer: "Morgaon (Mayureshwar)",
                explain: "Pilgrims usually begin at Morgaon, the Mayureshwar temple."
            },
            {
                question: "In Andhra Pradesh and Telangana, the festival is commonly called:",
                options: ["Onam", "Vinayaka Chavithi", "Pongal", "Bihu"],
                answer: "Vinayaka Chavithi",
                explain: "Vinayaka Chavithi is the regional name there."
            },
            {
                question: "Gowri Habba, often linked with Ganesh Chaturthi, is especially celebrated in:",
                options: ["Karnataka", "Ladakh", "Goa only as Christmas", "Kerala as Onam"],
                answer: "Karnataka",
                explain: "Gowri Habba honours Goddess Gauri just before Ganesha in Karnataka."
            },
            {
                question: "Sankashti Chaturthi is a monthly vow observed on:",
                options: ["Every full moon only", "Krishna Paksha Chaturthi", "Every Sunday", "Makar Sankranti only"],
                answer: "Krishna Paksha Chaturthi",
                explain: "Sankashti falls on the fourth day of the dark fortnight."
            },
            {
                question: "Which Mumbai pandal is popularly nicknamed 'King of Ganesh mandals'?",
                options: ["Lalbaugcha Raja", "Golden Temple", "Jagannath Puri", "Meenakshi"],
                answer: "Lalbaugcha Raja",
                explain: "Lalbaugcha Raja is among the most famous Sarvajanik mandals."
            },
            {
                question: "The eight Ashtavinayak temples are all located in which region?",
                options: ["Tamil Nadu coast", "Maharashtra, around Pune", "Rajasthan desert", "Assam hills"],
                answer: "Maharashtra, around Pune",
                explain: "They lie in Pune and nearby districts."
            },
            {
                question: "A second Ganesha Jayanti is also observed in which month in some traditions?",
                options: ["Magha", "Ashadha only", "Pausha never", "Shravan as Diwali"],
                answer: "Magha",
                explain: "Maghi Ganesh Jayanti is another traditional birthday observance."
            }
        ]
    },
    {
        name: "Vighnaharta Master",
        seconds: 9,
        questions: [
            {
                question: "Which Purana is especially devoted to Ganesha's legends and forms?",
                options: ["Yoga Vasistha only", "Mudgala Purana", "Yoga Sutra of Patanjali", "Arthashastra"],
                answer: "Mudgala Purana",
                explain: "The Mudgala and Ganesha Puranas focus on Ganesha."
            },
            {
                question: "Ganesha is called Pratham Pujya because he is worshipped:",
                options: ["Last at funerals only", "First among the gods in puja", "Only by children", "Only at midnight"],
                answer: "First among the gods in puja",
                explain: "Rituals usually begin with Ganesha invocation."
            },
            {
                question: "In the Ashtavinayak circuit, Siddhatek is associated with which form?",
                options: ["Siddhivinayak", "Ballaleshwar", "Varadavinayak", "Chintamani"],
                answer: "Siddhivinayak",
                explain: "Siddhatek is the shrine of Siddhivinayak."
            },
            {
                question: "Ballaleshwar, the only Ashtavinayak named after a devotee, is in:",
                options: ["Pali", "Ozar", "Lenyadri", "Theur"],
                answer: "Pali",
                explain: "Ballaleshwar of Pali is named after the boy-devotee Ballal."
            },
            {
                question: "Chintamani Vinayak of the Ashtavinayak group is at:",
                options: ["Theur", "Ranjangaon", "Mahad", "Morgaon"],
                answer: "Theur",
                explain: "Theur is the seat of Chintamani."
            },
            {
                question: "Mahaganapati of Ranjangaon is linked with Ganesha in which fierce aspect?",
                options: ["A dancing peacock only", "A warrior who helped Shiva against Tripurasura", "A river guardian of Ganga only", "A moon god"],
                answer: "A warrior who helped Shiva against Tripurasura",
                explain: "Tradition says Mahaganapati aided Shiva against the Tripura demons."
            },
            {
                question: "Girijatmaj of Lenyadri is unique because the temple is:",
                options: ["On a sea rock", "Inside Buddhist-era caves in a hill", "Made entirely of gold bricks", "Under a desert dune"],
                answer: "Inside Buddhist-era caves in a hill",
                explain: "Lenyadri's Girijatmaj shrine is in a rock-cut cave complex."
            },
            {
                question: "Vighnahar (Vighneshwar) of Ozar is especially invoked to:",
                options: ["Stop rainfall forever", "Destroy or ward off obstacles", "Replace all other gods", "Mark the new year in China"],
                answer: "Destroy or ward off obstacles",
                explain: "Vighnahar means the one who removes vighna, obstacles."
            }
        ]
    }
];
