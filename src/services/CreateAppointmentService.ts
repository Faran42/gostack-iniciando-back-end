/* eslint-disable no-unused-vars */
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointments';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({
    date,
    provider_id,
  }: RequestDTO): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDay = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDay) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
