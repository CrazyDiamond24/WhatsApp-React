import React from 'react'
import { useFormRegister } from '../customHooks/useFormRegister';

export function RobotFilter(props) {
    const [register] = useFormRegister({ ...props.filterBy }, props.onChangeFilter)


    return (
        <form className='robot-filter' >
            <section>
                <label htmlFor="model">Text</label>
                <input {...register('model', 'text')} />
            </section>
            <section>
                <label htmlFor="minBatteryStatus">Numerical</label>
                <input {...register('minBatteryStatus', 'number')} />
            </section>
        </form>
    )
}
