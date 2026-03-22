require('dotenv').config();
const { db } = require('./src/config/firebase');

async function seedData() {
  const childId = 'child123';
  
  const mockSessions = [
    {
      id: "mock_session_1",
      duration: 2700, // 45m
      createdAt: new Date("2025-12-25T16:30:00Z").toISOString(),
      cubesConnected: [1, 2, 2, 3, 4, 1, 2, 1, 3, 4, 2, 1], // 12 blocks
      structureData: { name: "Bridge Structure", isUnique: true }
    },
    {
      id: "mock_session_2",
      duration: 1800, // 30m
      createdAt: new Date("2025-12-26T14:15:00Z").toISOString(),
      cubesConnected: [1, 1, 2, 2, 3, 4], // 6 blocks
      structureData: { name: "Simple Tower", isUnique: false }
    },
    {
      id: "mock_session_3",
      duration: 3600, // 60m
      createdAt: new Date("2025-12-27T10:00:00Z").toISOString(),
      cubesConnected: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 1, 1], // 16 blocks
      structureData: { name: "Complex Castle", isUnique: true }
    },
    {
      id: "1", // to match frontend hardcoded "1"
      duration: 2700, 
      createdAt: new Date("2025-12-28T16:30:00Z").toISOString(),
      cubesConnected: [1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 1], // 12 blocks
      structureData: { name: "3D Build Preview", isUnique: true }
    },
    {
      id: "2", // to match frontend hardcoded "2"
      duration: 2000, 
      createdAt: new Date("2025-12-29T10:30:00Z").toISOString(),
      cubesConnected: [1, 2, 3, 4, 5, 6, 7], // 7 blocks
      structureData: { name: "Robot Prototype", isUnique: true }
    }
  ];

  const mockInsights = [
    {
      id: "mock_insight_1",
      sessionId: "mock_session_1",
      childId: childId,
      cognitive: 8,
      problemSolving: 9,
      creativity: 7,
      overall: 8.0,
      summary: "Sanuki showed excellent spatial awareness today. She built a stable base before expanding vertically, indicating improved planning skills.",
      createdAt: new Date("2025-12-25T16:30:00Z").toISOString()
    },
    {
      id: "mock_insight_2",
      sessionId: "mock_session_2",
      childId: childId,
      cognitive: 6,
      problemSolving: 5,
      creativity: 8,
      overall: 6.3,
      summary: "Built a quick tower structure, experimenting freely with colors.",
      createdAt: new Date("2025-12-26T14:15:00Z").toISOString()
    },
    {
      id: "mock_insight_3",
      sessionId: "mock_session_3",
      childId: childId,
      cognitive: 9,
      problemSolving: 9,
      creativity: 10,
      overall: 9.3,
      summary: "Incredible persistence on the complex castle structure.",
      createdAt: new Date("2025-12-27T10:00:00Z").toISOString()
    },
    {
      id: "mock_insight_4",
      sessionId: "1",
      childId: childId,
      cognitive: 8.5,
      problemSolving: 8.5,
      creativity: 8.5,
      overall: 8.5,
      summary: "Sanuki showed excellent spatial awareness today. She built a stable base before expanding vertically, indicating improved planning skills.",
      createdAt: new Date("2025-12-28T16:30:00Z").toISOString()
    },
    {
      id: "mock_insight_5",
      sessionId: "2",
      childId: childId,
      cognitive: 7.5,
      problemSolving: 7.0,
      creativity: 8.0,
      overall: 7.5,
      summary: "Explored building a robot showing imaginative assembly sequences.",
      createdAt: new Date("2025-12-29T10:30:00Z").toISOString()
    }
  ];

  try {
    const batch = db.batch();
    
    mockSessions.forEach(session => {
      const docRef = db.collection('playSessions').doc(session.id);
      batch.set(docRef, { ...session, childId });
    });

    mockInsights.forEach(insight => {
        const docRef = db.collection('insights').doc(insight.id);
        batch.set(docRef, insight);
    });

    await batch.commit();
    console.log("Successfully seeded mock sessions and insights!");
    process.exit(0);
  } catch(e) {
    console.error("Error seeding", e);
    process.exit(1);
  }
}

seedData();
