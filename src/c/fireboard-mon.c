#include <pebble.h>
#include "channel.h"

static Window *s_window;
static TextLayer *s_temp_readouts[6];
static Channel channels[6];
/*
static void prv_select_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "SELECT!");
  text_layer_set_text(s_text_layer, "Penis");
}

static void prv_up_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "UP!");
  text_layer_set_text(s_text_layer, "Up");
}

static void prv_down_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "DOWN!");
  text_layer_set_text(s_text_layer, "Down");
}

static void prv_click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, prv_select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, prv_up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, prv_down_click_handler);
}
*/
static void prv_window_load(Window *window) {
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  //static char *readoutString[6];
  
  for( int i=0; i<6; i++ ) {
    int padding = 10;
    bool leftCol = (i%2==0);
    int width = (bounds.size.w / 2) - 2*padding;
    int height = width/2;
    int leftEdge = leftCol ? padding : width + 3*padding;
    int topEdge = bounds.size.h - (1+(5-i)/2) * height; 

    Channel channel = channels[i];
    s_temp_readouts[i] = text_layer_create(GRect(leftEdge,topEdge,width,height));
    text_layer_set_text(s_temp_readouts[i], printChannel(&channel));
    text_layer_set_text_alignment(s_temp_readouts[i], GTextAlignmentLeft);
    layer_add_child(window_layer, text_layer_get_layer(s_temp_readouts[i]));
  }
}

static void prv_window_unload(Window *window) {
  for( int i=0; i<6; i++ ) {
    text_layer_destroy(s_temp_readouts[i]);
  }
}

static void prv_data_init(void) {
  for( int i=0; i<6; i++ ) {
    channels[i].id=i+1;
    char *defaultName = "Channel X";
    snprintf(channels[i].name, sizeof defaultName, "Channel %d", channels[i].id);
    channels[i].lastTemp = 123.45;
    channels[i].thisTemp = 543.21;
    channels[i].connected = (i<3)?true:false;
  }
}

static void prv_init(void) {
  s_window = window_create();
  prv_data_init();
//  window_set_click_config_provider(s_window, prv_click_config_provider);
  window_set_window_handlers(s_window, (WindowHandlers) {
    .load = prv_window_load,
    .unload = prv_window_unload,
  });
  const bool animated = true;
  window_stack_push(s_window, animated);
}

static void prv_deinit(void) {
  window_destroy(s_window);
}

int main(void) {
  prv_init();

  APP_LOG(APP_LOG_LEVEL_DEBUG, "Done initializing, pushed window: %p", s_window);
  
  app_event_loop();
  prv_deinit();
}
