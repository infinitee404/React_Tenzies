import React from 'react'
import './die.css'

const Die = ({ isHeld, holdDice, value }) => {
	const styles = {
		backgroundColor: isHeld ? '#59E391' : '#FFFFFF',
	}

	const valueClassMap = {
		1: 'die-one',
		2: 'die-two',
		3: 'die-three',
		4: 'die-four',
		5: 'die-five',
		6: 'die-six',
	}

	const valueClass = valueClassMap[value] || ''

	return (
		<div
			className='die-face'
			style={styles}
			onClick={holdDice}
		>
			<div className={`valueClass ${valueClass}`}>
				{Array.from({ length: value }, (_, index) => (
					<div
						key={index}
						className='dot'
					/>
				))}
			</div>
		</div>
	)
}

export default Die
