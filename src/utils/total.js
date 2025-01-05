export default function total(cards) {
    let sum = 0;
    
    for (var card of cards) {
        sum += rankValues[card.rank];
    }

    let index = 0;
    while (sum > 21 && index < cards.length) {
        if (cards[index].rank === 'A') {
            sum -= 10;
        }
        index++;
    }
    
    return sum;
}

const rankValues = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'A': 11
}