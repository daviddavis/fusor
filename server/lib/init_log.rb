require "fusor/multilog"

module Fusor
  if Rails.root.nil?
    @default_log_file = nil
  else
    @default_log_file = File.join(Rails.root, "log/fusor.log")
  end

  def self.log
    @log ||= MultiLogger.new(Rails.logger)
  end

  def self.log_change_deployment(deployment = nil)
    if deployment.nil?
      log.attach(@default_log_file)
    else
      FileUtils.mkdir_p(self.log_file_dir(deployment.name, deployment.id)) unless File.exist?(self.log_file_dir(deployment.name, deployment.id))
      log.attach(self.log_file_path(deployment.name, deployment.id))
    end
  end

  def self.start_collect_satellite_logs(deployment_name, deployment_id)
    FileUtils.mkdir_p(self.log_file_dir(deployment_name, deployment_id)) unless File.exist?(self.log_file_dir(deployment_name, deployment_id))
    log.collect(self.log_file_dir(deployment_name, deployment_id))
  end

  def self.stop_collect_satellite_logs(deployment_name, deployment_id)
    log.stop_collect(self.log_file_dir(deployment_name, deployment_id))
  end

  def self.log_file_dir(deployment_name, deployment_id)
    return File.join(Rails.root, 'log') if deployment_name.nil? and deployment_id.nil?
    File.join(Rails.root, 'log', 'deployments', "#{deployment_name.gsub(/[^0-9A-Za-z\-]/, '_')}-#{deployment_id}")
  end

  def self.log_file_name(deployment_name, deployment_id)
    return 'fusor.log' if deployment_name.nil? and deployment_id.nil?
    'deployment.log'
  end

  def self.log_file_path(deployment_name, deployment_id)
    File.join(self.log_file_dir(deployment_name, deployment_id), self.log_file_name(deployment_name, deployment_id))
  end
end
