const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


module.exports = {

  getCommitments: async () => {
    return new Promise((resolve, reject) =>
      prisma.Commitment.findMany({
        orderBy: [
          {
            startDateTime: 'asc'
          }
        ]
      })
        .then((c) => {
          
          resolve(c);
        })
        .catch(() => {
          reject({
            error: "An error occurred while querying the database for cds",
          });
        })
    );
  },

  //da modificare di modo di ricevere un array di commitment
  //da modificare la recurrency, non voglio dover specificare i giorni ma solo "daily, weekly, monthly"
  /*createNewCommitment(newCommitment) {
    return new Promise(async (resolve, reject) => {
      try {
        const createdCommitment = await prisma.commitment.create({
          data: {
            name: newCommitment.name,
            startDateTime: newCommitment.startDateTime,
            endDateTime: newCommitment.endDateTime,
            recurrency: newCommitment.recurrency,
            category: newCommitment.category,
            userId: newCommitment.userId,
          },
        });
        resolve(createdCommitment);
      } catch (error) {
        reject(error);
      }
    });
  },*/

  createNewCommitments(commitments) {
    return new Promise(async (resolve, reject) => {
      try {
        const createdCommitments = [];
  
        for (const newCommitment of commitments) {
          const createdCommitment = await prisma.commitment.create({
            data: {
              name: newCommitment.name,
              startDateTime: newCommitment.startDateTime,
              endDateTime: newCommitment.endDateTime,
              recurrency: newCommitment.recurrency,
              category: newCommitment.category,
              userId: newCommitment.userId,
            },
          });
  
          createdCommitments.push(createdCommitment);
        }
  
        resolve(createdCommitments);
      } catch (error) {
        reject(error);
      }
    });
  },
  

  updateCommitment(commitmentId, updatedData) {
    let intCommitmentId = parseInt(commitmentId);
    try {
      const updatedCommitment = prisma.Commitment.update({
        where: { id: intCommitmentId },
        data: updatedData,
      });
      return updatedCommitment;
    } catch (error) {
      throw new Error("An error occurred while updating the commitment");
    }
  },

  

deleteCommitment(commitmentId) {
  return new Promise(async (resolve, reject) => {
    let intCommitmentId = parseInt(commitmentId);
    try {
      const deletedCommitment = await prisma.Commitment.delete({
        where: {
          id: intCommitmentId,
        },
      });
      resolve(deletedCommitment);
    } catch (error) {
      reject(error);
    }
  });
},


};