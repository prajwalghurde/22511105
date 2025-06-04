/**

 * @param {Object} req - 
 * @param {Object} res - 
 * @param {Function} next - 
 */
const calculateAverage = (req, res, next) => {
    try {
      const { numbers } = req.body;
      
      // Validate input
      if (!Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ 
          error: 'Input must be a non-empty array of numbers' 
        });
      }
  
      // Check for non-number values
      if (numbers.some(isNaN)) {
        return res.status(400).json({ 
          error: 'Array must contain only numbers' 
        });
      }
  
      // Calculate average
      const sum = numbers.reduce((acc, num) => acc + Number(num), 0);
      const average = sum / numbers.length;
  
      res.json({ 
        average: parseFloat(average.toFixed(4)),
        count: numbers.length,
        timestamp: new Date().toISOString()
      });
  
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = { calculateAverage };