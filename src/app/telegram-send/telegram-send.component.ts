import { Component, OnInit } from '@angular/core';
import Telegram from 'telegram-send-message';
import { TelegramSendService } from '../service/telegram-send.service';
import { FormControl, Validators, FormArray } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { SettingsUsersService } from '../service/settings-users.service';
declare var $: any;

@Component({
  selector: 'app-telegram-send',
  templateUrl: './telegram-send.component.html',
  styleUrls: ['./telegram-send.component.scss'],
})
export class TelegramSendComponent implements OnInit {
  array_type_department: any;
  array_city: any;
  array_department: any;
  array_position: any;
  array_department_office: any;

  alert_message_successfully = 'Успешно отправленно';

  trade_dot = false;
  office = false;

  id_telegram_bot_pdp: any;

  not_id_chat_trade_dot = [];
  not_id_chat_office = [];
  list_name_department_office = [];
  department_list_names = [];

  type_department: any;
  department_office: any;

  TOKEN_id = "1200991119:AAE8_piX_1A1OgIVnaYFXwPNBDMleac3xRk";
  list_TOKEN_id: any;
  list_user_name: any;
  get_user_name: any
  new_token_id: any;
  new_token_name: any;
  name_bot: any;
  good_token: any;



  user_name = this.loginService.user_name

  city = new FormControl('', [Validators.required]);
  department = new FormControl('', [Validators.required]);
  position = new FormControl('', [Validators.required]);
  message_text = new FormControl('', [Validators.required]);

  city_office = new FormControl({ value: '', disabled: true });

  constructor(
    private telegramSendService: TelegramSendService,
    private loginService: LoginService,
    private settingsUserService: SettingsUsersService
  ) {
    this.telegramSendService.get_type_department().subscribe((res) => {
      console.log(res);
      this.array_type_department = JSON.parse(res);
      console.log(this.array_type_department);
      console.log(this.type_department);
    });

    this.telegramSendService.get_my_token(this.loginService.user_id).subscribe(res => {
      this.list_TOKEN_id = JSON.parse(res);
      console.log(this.list_TOKEN_id);

    })
    this.settingsUserService.get_users().subscribe(res => {
      this.list_user_name = JSON.parse(res);
      console.log(this.list_user_name);

    })

  }
  select_token_name(item_list_TOKEN_id) {
    this.name_bot = item_list_TOKEN_id
  }

  add_TOKEN() {
    this.telegramSendService.add_TOKEN_user(this.get_user_name.user_id, this.get_user_name.user_name, this.new_token_id, this.new_token_name).subscribe(res => {
      this.good_token = JSON.parse(res)
      console.log(this.good_token);
      this.alert_good()
    })
  }

  select_personal() {
    this.telegramSendService.selectPersonal(this.department_office).subscribe(res => {
      this.department_list_names = JSON.parse(res);
    })
  }

  change_select(item) {
    console.log(this.type_department);
    console.log(item);

    if (item === 'Офис') {
      this.trade_dot = false;
      this.office = true;
      this.telegramSendService.get_department_office(this.type_department).subscribe((res) => {
        console.log(res);
        this.array_department_office = JSON.parse(res);
        this.department_office = null
      });
      return;
    }
    if (item === 'Торговая точка') {
      this.office = false;
      this.trade_dot = true;
      console.log(item);
      this.telegramSendService.get_city().subscribe((res) => {
        this.array_city = JSON.parse(res);
        this.array_position = null;
      });
    }
    return;
  }

  //  get_department_office(){
  //     this.telegramSendService.get_type_department(this.type_department.value ,'Днепр',).subscribe(res => {
  //       console.log(res);
  //       this.array_type_department = JSON.parse(res);
  //       console.log(this.department);

  //     })
  //   }

  get_department_trade_dot() {
    this.telegramSendService.get_department_trade_dot(this.city.value).subscribe((res) => {
      this.array_department = JSON.parse(res);
      this.array_position = null;
    });
  }

  get_position() {
    this.telegramSendService.get_position().subscribe((res) => {
      this.array_position = JSON.parse(res);

    });
  }


  send_message_bot() {
    console.log(this.department_list_names);
    console.log(this.list_name_department_office);


    if (this.office === true) {
      if (this.department_list_names.length === 0) {
        console.log('Нету ни одного ID');
        return this.alert_error_danger();
      } else {
        if (this.list_name_department_office.length === 0) {
          this.not_id_chat_office = []
          this.department_list_names.forEach((element) => {
            console.log(element);

            if (element.id_telegram_chat === '0') {
              this.not_id_chat_office.push({
                'first_name': element.first_name,
                'last_name': element.last_name,
                'department': element.department,
                'id_telegram_chat': element.id_telegram_chat
              });
            } else {
            }
            Telegram.setToken(this.TOKEN_id);
            Telegram.setRecipient(element.id_telegram_chat);
            Telegram.setMessage(this.message_text.value);
            Telegram.send();
          });

          if (this.not_id_chat_office.length !== 0) {
            console.log(this.not_id_chat_office);
            return this.alert_error();
          } else {
            $('#successfully_sent').modal('show');
            setTimeout(function () {
              $('#successfully_sent').modal('hide');
            }, 2000);
          }
        } else {
          console.log(this.list_name_department_office);
          this.not_id_chat_office = []
          this.list_name_department_office.forEach((element) => {
            console.log(element);

            if (element.id_telegram_chat === '0') {
              this.not_id_chat_office.push({
                'first_name': element.first_name,
                'last_name': element.last_name,
                'department': element.department,
                'id_telegram_chat': element.id_telegram_chat
              });
            } else {
            }
            Telegram.setToken(this.TOKEN_id);
            Telegram.setRecipient(element.id_telegram_chat);
            Telegram.setMessage(this.message_text.value);
            Telegram.send();
          });

          if (this.not_id_chat_office.length !== 0) {
            console.log(this.not_id_chat_office);
            return this.alert_error();
          } else {
            $('#successfully_sent').modal('show');
            setTimeout(function () {
              $('#successfully_sent').modal('hide');
            }, 2000);
          }

        }
      }
      return;
    }
    if (this.trade_dot === true) {
      if (this.position.invalid) {
        console.log('position.invalid');
        return this.position.markAsTouched();
      }
      if (this.message_text.invalid) {
        console.log('message_text.invalid');
        return this.message_text.markAsTouched();
      }
      if (this.department.invalid) {
        console.log('type_department.invalid');

        return this.department.markAsTouched();
      }
      this.telegramSendService.get_data_send_bot(this.department.value).subscribe((res) => {
        console.log(res);
        this.id_telegram_bot_pdp = JSON.parse(res);
        if (this.id_telegram_bot_pdp === null) {
          console.log('Нету ни одного ID');
          return this.alert_error_danger();
        } else {
          this.not_id_chat_trade_dot = []
          this.id_telegram_bot_pdp.forEach((element) => {
            console.log(element.id_telegram_chat);
            if (element.id_telegram_chat === '0') {
              this.not_id_chat_trade_dot.push({
                'first_name': element.first_name,
                'last_name': element.last_name,
                'department': element.department,
                'id_telegram_chat': element.id_telegram_chat
              });
            }
            Telegram.setToken(this.TOKEN_id);
            Telegram.setRecipient(element.id_telegram_chat);
            Telegram.setMessage(this.message_text.value);
            Telegram.send();
          });
          $('#successfully_sent').modal('show');
          setTimeout(function () {
            $('#successfully_sent').modal('hide');
          }, 2000);
          console.log(this.not_id_chat_trade_dot);
        }
      });
      return;
    }
  }

  alert_error() {
    $('#ERROR_sent').modal('show');
    setTimeout(function () {
      $('#ERROR_sent').modal('hide');
    }, 5000);
  }

  alert_error_danger() {
    $('#all_ERROR_sent').modal('show');
    setTimeout(function () {
      $('#all_ERROR_sent').modal('hide');
    }, 5000);

  }
  alert_good() {
    $('#best_token').modal('show');
    setTimeout(function () {
      $('#best_token').modal('hide');
    }, 5000);

  }



  ngOnInit(): void { }
}
